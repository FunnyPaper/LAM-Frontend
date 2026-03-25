export type CreateScriptRunDto = {
  envId?: string;
  scriptVersionId: string;
}

export type CreateScriptRunProvider = (data: CreateScriptRunDto) => Promise<void>