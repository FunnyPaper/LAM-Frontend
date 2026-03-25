export type CreateScriptDto = {
  name: string,
  description?: string,
}

export type CreateScriptProvider = (data: CreateScriptDto) => Promise<void>