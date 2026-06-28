import type * as monacoEditor from 'monaco-editor';

export interface MonacoJsonDefaults {
  setDiagnosticsOptions(options: unknown): void;
}

export interface MonacoJsonNamespace {
  jsonDefaults: MonacoJsonDefaults;
}

export interface MonacoWithJson extends monacoEditor.MonacoStatic {
  json: MonacoJsonNamespace;
}
