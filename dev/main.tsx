import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.scss';
import { App } from 'lam-frontend/app';
import { initTranslations } from 'lam-frontend/i18n/i18n';

initTranslations()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      apiProviders={{
        login: async (data) => console.log(data),
        register: async (data) => console.log(data),
        getProfile: async () => {
          return new Promise((resolve) =>
            setTimeout(() => resolve({ email: 'email' }), 5000)
          );
        },
        updateProfile: async (data) => console.log(data),
        getEnv: async () => ({ id: '1', name: 'name' }),
        getEnvs: async () => [
          {
            id: '1',
            name: 'env1111111111111111111111111111111112222222222222222222222222222222222',
            description: `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pharetra efficitur vehicula. Curabitur et arcu eget nibh ornare venenatis. Morbi vitae massa feugiat, pharetra nibh at, mattis ante. Vivamus facilisis turpis ut nulla sodales, id tempus eros finibus. Cras tristique nisl et maximus consequat. Nulla lacinia, justo vitae commodo sagittis, est orci placerat lorem, at laoreet lacus ex at quam. Ut sem nisi, ullamcorper id mi eget, bibendum semper mauris. Sed lacinia urna eu neque fermentum gravida.

Nullam quis ipsum ultricies nibh ornare lacinia. Nulla nisi libero, bibendum ac diam eu, feugiat pretium dolor. Quisque congue, nisl sed hendrerit tincidunt, mauris mi imperdiet leo, vitae scelerisque lorem nulla ut quam. Quisque hendrerit tempor bibendum. Quisque consequat neque sed tellus euismod, sed gravida erat semper. Etiam auctor mattis imperdiet. Cras tincidunt dictum ipsum fringilla consectetur. Quisque porta arcu nec arcu tempus, at lobortis neque facilisis. Phasellus in elit pharetra, congue turpis quis, ultrices lacus.
            `,
            data: { fieldA: 'A' },
          },
          { id: '2', name: 'env2', data: { fieldB: 'B' } },
        ],
        createEnv: async (data) => console.log(data),
        updateEnv: async (data) => console.log(data),
        removeEnv: async (id) => console.log(id),
      }}
    />
  </StrictMode>
);
