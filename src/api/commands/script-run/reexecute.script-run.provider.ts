export type ReexecuteScriptRunDto = {
  envId?: string
}

export type ReexecuteScriptRunProvider = (id: string, data: ReexecuteScriptRunDto) => Promise<void>