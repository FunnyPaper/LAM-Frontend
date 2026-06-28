import type { OnMount } from '@monaco-editor/react';
import { validateSkippingVars } from 'lam-frontend/utils/schema-validation';
import { useCallback, type RefObject } from 'react';
import * as monaco from 'monaco-editor';
import { z } from 'zod';

export function useUpdateZodMarkersHook(
  editorRef: RefObject<Parameters<OnMount>[0] | null>,
  zodDecorationsRef: RefObject<string[]>,
  setIsValid: (val: boolean) => void,
  schema?: z.ZodType
) {
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

              zodMarkers.push({
                range: new monaco.Range(targetLine, targetColumn, targetLine, targetColumn + fieldName.length),
                options: {
                  inlineClassName: 'editor-highlight__error',
                  hoverMessage: { value: `${path}: ${issue.message}` },
                },
              });
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
    [editorRef, schema, setIsValid, zodDecorationsRef]
  );

  return updateZodMarkers;
}
