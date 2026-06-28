import { useCallback, type RefObject } from 'react';
import { patchMonacoSchema } from '../utils';
import type { OnMount } from '@monaco-editor/react';
import { z } from 'zod';

export function useEditorDidMountHook(
  editorRef: RefObject<Parameters<OnMount>[0] | null>,
  saveButtonRef: RefObject<HTMLButtonElement | null>,
  content: string,
  updateZodMarkers: (val: string) => void,
  updateEnvMarkers: (val: string) => void,
  schema?: z.ZodType
) {
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monacoCore) => {
      editorRef.current = editor;
      editor.addAction({
        id: 'save-action',
        label: 'Save',
        keybindings: [monacoCore.KeyMod.CtrlCmd | monacoCore.KeyCode.KeyS],
        run: () => saveButtonRef.current?.click(),
      });
      // This cast does not make any sense but makes monaco happy
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (monacoCore as any).json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'scheme://lam-json/schema',
            fileMatch: ['*'],
            schema: patchMonacoSchema(schema?.toJSONSchema()),
          },
        ],
      });
      updateZodMarkers(content);
      updateEnvMarkers(content);
    },
    [content, editorRef, saveButtonRef, schema, updateEnvMarkers, updateZodMarkers]
  );

  return handleEditorDidMount;
}
