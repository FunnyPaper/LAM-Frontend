import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  LinearProgress,
  Stack,
  Tooltip,
  TextField,
  outlinedInputClasses,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Editor, { type OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import { z } from 'zod';
import { validateSkippingVars } from 'lam-frontend/utils/schema-validation';
import { downloadFile } from 'lam-frontend/utils/download-file';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';
import { Archive, Publish, SaveAs, Warning } from '@mui/icons-material';
import { EditScriptModal } from '../modals/edit-script.modal';
import type { ScriptDto } from 'lam-frontend/api/queries/script.provider';
import type { ScriptVersionDto } from 'lam-frontend/api';
import { useForm, useWatch } from 'react-hook-form';
import { getScriptVersionStateColor } from 'lam-frontend/utils/colors';

export type ScriptEditorProps = {
  script: ScriptDto;
  scriptVersion?: ScriptVersionDto;
  format: 'json';
  initialContent?: string;
  onSave: (content: Record<string, unknown>) => void;
  onSaveAs: (content: Record<string, unknown>, data: UpdateScriptDto) => void;
  onPublish: (script: ScriptDto, version: ScriptVersionDto, data: { name: string }) => void;
  onArchive: (script: ScriptDto, version: ScriptVersionDto) => void;
  schema?: z.ZodType;
};

// TODO: Update state update for validation
// it should be treated as a derived state I think (left in effects because it was easier to write at the moment :') )

export function ScriptEditor({
  script,
  scriptVersion,
  format,
  initialContent = '{}',
  onSave,
  onSaveAs,
  onPublish,
  onArchive,
  schema,
}: ScriptEditorProps) {
  const { t } = useTranslation('scripts');

  // TODO: There are too many states at the moment
  // Split into smaller components / hooks in the meantime
  const [content, setContent] = useState<string>(initialContent);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const [isEdited, setIsEdited] = useState(false);

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<Parameters<OnMount>[0]>(null);
  const envDecorationsRef = useRef<string[]>([]);
  const zodDecorationsRef = useRef<string[]>([]);

  const theme = useTheme();

  const { control, register } = useForm<{ name: string }>({
    defaultValues: { name: scriptVersion?.name ?? script.name },
  });
  const name = useWatch({ control, name: 'name' });

  const handleSave = useCallback(() => {
    if (isValid && onSave && editorRef.current) {
      setSaving(true);
      try {
        onSave(JSON.parse(editorRef.current.getValue()));
      } catch {
        onSave(JSON.parse(initialContent));
      }
    }
  }, [initialContent, isValid, onSave]);

  const handleSaveAs = useCallback((data: UpdateScriptDto) => {
    if (isValid && onSaveAs && editorRef.current) {
      setSaving(true);
      try {
        onSaveAs(JSON.parse(editorRef.current.getValue()), data);
      } catch {
        onSaveAs(JSON.parse(initialContent), data);
      } finally {
        setIsSaveAsOpen(false);
      }
    }
  }, [initialContent, isValid, onSaveAs]);

  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
      };
      reader.readAsText(file);
    }

    event.target.value = '';
  }, []);

  const handleContentChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  }, []);

  const updateEnvMarkers = useCallback((content: string) => {
    if (editorRef.current) {
      const markers: monaco.editor.IModelDeltaDecoration[] = [];
      const regex = /{{([^}]+)}}/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        const beforeMatch = content.substring(0, start);
        const linesBefore = beforeMatch.split('\n');
        const startLine = linesBefore.length;
        const startColumn = linesBefore[linesBefore.length - 1].length + 1;

        const afterMatch = content.substring(0, end);
        const linesAfter = afterMatch.split('\n');
        const endLine = linesAfter.length;
        const endColumn = linesAfter[linesAfter.length - 1].length + 1;

        markers.push({
          range: new monaco.Range(startLine, startColumn, endLine, endColumn),
          options: {
            inlineClassName: 'editor-highlight__env',
            hoverMessage: { value: `Environment variable: ${match[1]}` },
          },
        });
      }

      const newDecorations = editorRef.current?.getModel()?.deltaDecorations(envDecorationsRef.current, markers);
      envDecorationsRef.current = newDecorations || [];
    }
  }, []);

  const updateZodMarkers = useCallback(
    (content: string) => {
      if (editorRef.current && schema) {
        const zodMarkers: monaco.editor.IModelDeltaDecoration[] = [];

        try {
          const parsed = JSON.parse(content);
          const result = validateSkippingVars(schema, parsed);

          if (!result.success) {
            result.error.issues.forEach((issue) => {
              const path = issue.path.join('.');

              let targetLine = 1;
              let targetColumn = 1;

              const fieldName = path.split('.').pop() || path;
              const fieldRegex = new RegExp(`"${fieldName}"\\s*:`);
              const match = fieldRegex.exec(content);

              if (match) {
                const matchIndex = match.index;
                const linesBefore = content.substring(0, matchIndex).split('\n');
                targetLine = linesBefore.length;
                targetColumn = linesBefore[linesBefore.length - 1].length + 2;
              }

              // Create a range that covers the field name (just the field name itself)
              zodMarkers.push({
                range: new monaco.Range(targetLine, targetColumn, targetLine, targetColumn + fieldName.length),
                options: {
                  inlineClassName: 'editor-highlight__error',
                  hoverMessage: { value: `${path}: ${issue.message}` },
                },
              });

              return `${issue.path.join('.')}: ${issue.message}`;
            });

            setIsValid(false);
          } else {
            setIsValid(true);
          }
        } catch (e: unknown) {
          zodMarkers.push({
            range: new monaco.Range(1, 1, 1, 1),
            options: {
              inlineClassName: 'editor-highlight__error',
              hoverMessage: { value: (e as Error).message },
            },
          });

          setIsValid(false);
        }

        const newDecorations = editorRef.current?.getModel()?.deltaDecorations(zodDecorationsRef.current, zodMarkers);
        zodDecorationsRef.current = newDecorations || [];
      }
    },
    [setIsValid, schema]
  );

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.addAction({
      id: 'save-action',
      label: "Save",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => saveButtonRef.current?.click()
    });
    editor.onDidChangeModelContent(() => {
      setIsEdited(prev => prev || true);
    });
    monaco.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'lam-json',
          fileMatch: ['*'],
          schema: schema?.toJSONSchema(),
        },
      ],
    });
    updateZodMarkers(content);
    updateEnvMarkers(content);
  }, [content, schema, updateEnvMarkers, updateZodMarkers]);

  useEffect(() => {
    updateZodMarkers(content);
    updateEnvMarkers(content);
  }, [content, updateZodMarkers, updateEnvMarkers]);

  useEffect(() => {
    if (!saving) return;

    const progress = setInterval(() => {
      setSavingProgress((prev) => Math.min(prev + 5, 100));
    });

    const timer = setTimeout(() => {
      setSaving(false);
      setSavingProgress(0);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(progress);
    };
  }, [saving]);

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          height: '100%',
          border: '1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'paper',
            borderBottom: '1px solid #ccc',
            position: 'relative',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Stack direction="row" flex={1} alignItems="center">
              {(scriptVersion?.status !== 'Draft' && isEdited) && (
                <Tooltip title={t('editor.warning.nonDraftEdit')}>
                  <Box sx={{ padding: '5px', display: 'inline-flex', color: 'warning.dark' }}>
                    <Warning />
                  </Box>
                </Tooltip>
              )}
              <TextField
                {...register('name')}
                sx={{
                  [`& .${outlinedInputClasses.root}`]: {
                    fontSize: '0.8rem',
                    borderRadius: 0,
                  },
                  [`& .${outlinedInputClasses.input}`]: {
                    px: 2,
                    py: 1,
                  },
                }}
              />
              <Chip
                label={t(`version.status.${(scriptVersion?.status ?? 'Draft').toLowerCase()}`)}
                size="small"
                variant="filled"
                color={getScriptVersionStateColor(scriptVersion?.status ?? 'Draft')}
              />
            </Stack>
            <Box sx={{ display: 'flex', flex: 0 }}>
              <IconButton size="small" title={t('editor.upload')} component="label" sx={{ borderRadius: 0 }}>
                <input type="file" hidden onChange={handleUpload} accept=".json,application/json" />
                <FileUploadIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => downloadFile(content, `${name}.${format}`)}
                title={t('editor.download')}
                sx={{ borderRadius: 0 }}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                ref={saveButtonRef}
                color="primary"
                size="small"
                onClick={handleSave}
                disabled={!isValid || saving || initialContent === content}
                title={t('editor.save')}
                sx={{ borderRadius: 0 }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                color="primary"
                size="small"
                onClick={() => setIsSaveAsOpen(true)}
                disabled={!isValid || saving || initialContent === content}
                title={t('editor.saveAs')}
                sx={{ borderRadius: 0 }}
              >
                <SaveAs />
              </IconButton>
              {scriptVersion && scriptVersion.status != 'Published' && (
                <IconButton
                  sx={{ borderRadius: 0 }}
                  size="small"
                  title={t('editor.publish')}
                  onClick={() => onPublish(script, scriptVersion, { name })}
                >
                  <Publish />
                </IconButton>
              )}
              {scriptVersion && scriptVersion.status != 'Archived' && (
                <IconButton
                  sx={{ borderRadius: 0 }}
                  size="small"
                  title={t('editor.archive')}
                  onClick={() => onArchive(script, scriptVersion)}
                >
                  <Archive />
                </IconButton>
              )}
            </Box>
          </Stack>
          {saving && (
            <LinearProgress
              variant="determinate"
              value={savingProgress}
              sx={{ position: 'absolute', width: '100%', left: 0, bottom: 0 }}
            />
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            width: '100%',
            position: 'relative',
          }}
        >
          <Editor
            height="100%"
            language="json"
            value={content}
            onChange={handleContentChange}
            onMount={handleEditorDidMount}
            theme={theme.palette.mode == 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'off',
              renderLineHighlight: 'none',
              lineNumbers: 'on',
              lineNumbersMinChars: 3,
              overviewRulerLanes: 0,
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 10,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
              },
              padding: {
                top: 12,
                bottom: 12,
              },
            }}
          />
        </Box>
      </Box>
      <EditScriptModal
        open={isSaveAsOpen}
        onClose={() => setIsSaveAsOpen(false)}
        script={script}
        onEdit={handleSaveAs}
      />
    </Box>
  );
}
