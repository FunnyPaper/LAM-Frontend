import type { OnMount } from '@monaco-editor/react';
import type { ScriptDto, UpdateScriptDto } from 'lam-frontend/api';
import { MODAL_IDS, showModal } from 'lam-frontend/components/modals/modal.definitions';
import { useCallback, type RefObject } from 'react';

export function useSaveAsHook(
  editorRef: RefObject<Parameters<OnMount>[0] | null>,
  script: ScriptDto,
  initialContent: string,
  isValid: boolean,
  setSaving: (val: boolean) => void,
  onSaveAs: (val: Record<string, unknown>, data: UpdateScriptDto) => void
) {
  const handleSaveAs = useCallback(() => {
    if (!isValid || !editorRef.current || !onSaveAs) return;
    showModal(MODAL_IDS.EDIT_SCRIPT, {
      script,
      onEdit: (savedData: UpdateScriptDto) => {
        setSaving(true);
        const editorContent = editorRef.current?.getValue();
        try {
          onSaveAs(JSON.parse(editorContent || initialContent), savedData);
        } catch {
          onSaveAs(JSON.parse(initialContent), savedData);
        }
      },
    });
  }, [editorRef, initialContent, isValid, onSaveAs, script, setSaving]);

  return handleSaveAs;
}
