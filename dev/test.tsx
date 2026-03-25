import { App } from 'lam-frontend/app';
import { StrictMode } from 'react';
import { useAuthResourceHook } from './mocks/auth/use-auth-resource.hook';
import { useEnvResourceHook } from './mocks/envs/use-envs-resource.hook';
import { useScriptRunEventResourceHook } from './mocks/script-run-events/use-script-run-events-resource.hook';
import { useScriptRunResourceHook } from './mocks/script-runs/use-script-run-resource.hook';
import { useScriptVersionResourceHook } from './mocks/script-versions/use-script-version-resource.hook';
import { useScriptResourceHook } from './mocks/scripts/use-script-resource.hook';
import { useUserResourceHook } from './mocks/users/use-users-resource.hook';

export function Test() {
  const authResource = useAuthResourceHook();
  const envsResource = useEnvResourceHook();
  const usersResource = useUserResourceHook();
  const scriptRunEventsResource = useScriptRunEventResourceHook();
  const scriptRunResource = useScriptRunResourceHook();
  const scriptVersionResource = useScriptVersionResourceHook();
  const scriptResource = useScriptResourceHook();

  return (
    <StrictMode>
      <App
        authState={'loggedIn'}
        apiProviders={{
          auth: authResource,
          user: usersResource,
          env: envsResource,
          script: scriptResource,
          scriptVersion: scriptVersionResource,
          scriptRun: scriptRunResource,
          scriptRunEvent: scriptRunEventsResource,
        }}
      />
    </StrictMode>
  );
}
