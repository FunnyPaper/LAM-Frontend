import { createRoot } from 'react-dom/client';
import './global.scss';
import { initTranslations } from 'lam-frontend/i18n/i18n';
import { Test } from './test';

initTranslations();

createRoot(document.getElementById('root')!).render(<Test />);
