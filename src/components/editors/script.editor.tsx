import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, useTheme, LinearProgress } from '@mui/material';
import Editor, { type OnMount } from '@monaco-editor/react';
import { z } from 'zod';
import { downloadFile } from 'lam-frontend/utils/download-file';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';
import type { ScriptDto } from 'lam-frontend/api/queries/script.provider';
import type { ScriptVersionDto } from 'lam-frontend/api';
import { useForm, useWatch } from 'react-hook-form';
import { ScriptEditorToolbar } from './script-editor-toolbar';
import { useUpdateEnvMarkersHook } from './hooks/update-env-markers.hook';
import { useUpdateZodMarkersHook } from './hooks/update-zod-markers.hook';
import { useUploadHook } from './hooks/upload.hook';
import { useEditorDidMountHook } from './hooks/editor-did-mount.hook';
import { useSaveHook } from './hooks/save.hook';
import { useSaveAsHook } from './hooks/save-as.hook';

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
  const theme = useTheme();

  const [content, setContent] = useState<string>(initialContent);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);

  // Sync content with initialContent when prop changes (e.g., after save invalidation)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<Parameters<OnMount>[0]>(null);
  const envDecorationsRef = useRef<string[]>([]);
  const zodDecorationsRef = useRef<string[]>([]);

  const { control, setValue } = useForm<{ name: string }>({
    defaultValues: { name: scriptVersion?.name ?? script.name },
  });
  const name = useWatch({ control, name: 'name' });

  const handleNameChange = useCallback(
    (newName: string) => {
      setValue('name', newName, { shouldDirty: true });
    },
    [setValue]
  );

  const handleSave = useSaveHook(editorRef, initialContent, isValid, setSaving, onSave);
  const handleSaveAs = useSaveAsHook(editorRef, script, initialContent, isValid, setSaving, onSaveAs);
  const handleUpload = useUploadHook(setContent);

  const handleDownload = useCallback(() => {
    downloadFile(content, `${name}.${format}`);
  }, [content, format, name]);

  const handleContentChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  }, []);

  const updateEnvMarkers = useUpdateEnvMarkersHook(editorRef, envDecorationsRef);
  const updateZodMarkers = useUpdateZodMarkersHook(editorRef, zodDecorationsRef, setIsValid, schema);
  const handleEditorDidMount = useEditorDidMountHook(
    editorRef,
    saveButtonRef,
    content,
    updateZodMarkers,
    updateEnvMarkers,
    schema
  );

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
        <ScriptEditorToolbar
          scriptVersion={scriptVersion}
          name={name}
          onNameChange={handleNameChange}
          content={content}
          initialContent={initialContent}
          isValid={isValid}
          saving={saving}
          saveButtonRef={saveButtonRef}
          onDownload={handleDownload}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          onPublish={() => onPublish(script, scriptVersion!, { name })}
          onArchive={() => onArchive(script, scriptVersion!)}
          onUpload={handleUpload}
        />
        {saving && (
          <LinearProgress
            variant="determinate"
            value={savingProgress}
            sx={{ position: 'absolute', width: '100%', left: 0, bottom: 0 }}
          />
        )}

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
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
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
    </Box>
  );
}
