import { createContext } from "react";
import type { AuthResource } from "../api/resources/auth.resource";
import type { EnvResource } from "../api/resources/env.resource";
import type { UserResource } from "../api/resources/user.resource";
import type { ScriptResource } from "../api/resources/script.resource";
import type { ScriptVersionResource } from "../api/resources/script-version.resource";
import type { ScriptRunResource } from "../api/resources/script-run.resource";
import type { ScriptRunEventResource } from "../api/resources/script-run-event.resource";

export type ApiProviders = {
  auth: AuthResource,
  env: EnvResource,
  user: UserResource,
  script: ScriptResource,
  scriptRun: ScriptRunResource,
  scriptRunEvent: ScriptRunEventResource,
  scriptVersion: ScriptVersionResource
}

export const ApiProvider = createContext<ApiProviders | null>(null)
