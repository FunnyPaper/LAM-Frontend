import type { OnMount } from '@monaco-editor/react';
import { useCallback, type RefObject } from 'react';

export function useSaveHook(
  editorRef: RefObject<Parameters<OnMount>[0] | null>,
  initialContent: string,
  isValid: boolean,
  setSaving: (val: boolean) => void,
  onSave: (val: Record<string, unknown>) => void
) {
  const handleSave = useCallback(() => {
    if (isValid && onSave && editorRef.current) {
      setSaving(true);
      try {
        onSave(JSON.parse(editorRef.current.getValue()));
      } catch {
        onSave(JSON.parse(initialContent));
      }
    }
  }, [editorRef, initialContent, isValid, onSave, setSaving]);

  return handleSave;
}
