import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, useTheme, LinearProgress, Stack } from '@mui/material';
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
import { SaveAs } from '@mui/icons-material';
import { EditScriptModal } from '../modals/edit-script.modal';
import type { ScriptDto } from 'lam-frontend/api/queries/script.provider';

export type ScriptEditorProps = {
  script: ScriptDto;
  format: 'json';
  initialContent?: string;
  onSave?: (content: Record<string, unknown>) => void;
  onSaveAs?: (content: Record<string, unknown>, data: UpdateScriptDto) => void;
  schema?: z.ZodType;
};

// TODO: Update state update for validation
// it should be treated as a derived state I think (left in effects because it was easier to write at the moment :') )

export function ScriptEditor({ script, format, initialContent = '{}', onSave, onSaveAs, schema }: ScriptEditorProps) {
  const { t } = useTranslation('scripts');
  const [content, setContent] = useState<string>(initialContent);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);
  const editorRef = useRef<Parameters<OnMount>[0]>(null);
  const envDecorationsRef = useRef<string[]>([]);
  const zodDecorationsRef = useRef<string[]>([]);
  const theme = useTheme();

  const handleSave = () => {
    if (isValid && onSave) {
      setSaving(true);
      try {
        onSave(JSON.parse(content));
      } catch {
        onSave(JSON.parse(initialContent));
      }
    }
  };

  const handleSaveAs = (data: UpdateScriptDto) => {
    if (isValid && onSaveAs) {
      setSaving(true);
      try {
        onSaveAs(JSON.parse(content), data);
      } catch {
        onSaveAs(JSON.parse(initialContent), data);
      } finally {
        setIsSaveAsOpen(false);
      }
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);
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
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

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

  useEffect(() => {
    updateZodMarkers(content);
  }, [content, updateZodMarkers]);

  useEffect(() => {
    updateEnvMarkers(content);
  }, [content, updateEnvMarkers]);

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
            p: 1,
            borderBottom: '1px solid #ccc',
            position: 'relative',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="caption">
              {script.name}.{format}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" title={t('editor.upload')} component="label">
                <input type="file" hidden onChange={handleUpload} accept=".json,application/json" />
                <FileUploadIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => downloadFile(content, `${name}.${format}`)}
                title={t('editor.download')}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                color="primary"
                size="small"
                onClick={handleSave}
                disabled={!isValid || saving}
                title={t('editor.save')}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                color="primary"
                size="small"
                onClick={() => setIsSaveAsOpen(true)}
                disabled={!isValid || saving}
                title={t('editor.saveAs')}
              >
                <SaveAs />
              </IconButton>
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
