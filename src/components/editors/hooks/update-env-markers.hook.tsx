import type { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useCallback, type RefObject } from 'react';

export function useUpdateEnvMarkersHook(
  editorRef: RefObject<Parameters<OnMount>[0] | null>,
  envDecorationsRef: RefObject<string[]>
) {
  const updateEnvMarkers = useCallback(
    (content: string) => {
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
    },
    [editorRef, envDecorationsRef]
  );

  return updateEnvMarkers;
}
