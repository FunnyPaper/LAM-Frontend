import { useCallback } from 'react';

export function useUploadHook(setContent: (val: string) => void) {
  const handleUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          setContent(fileContent);
        };
        reader.readAsText(file);
      }
      event.target.value = '';
    },
    [setContent]
  );

  return handleUpload;
}
