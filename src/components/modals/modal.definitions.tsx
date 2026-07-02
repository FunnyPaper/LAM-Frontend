import type { ConfirmModalProps } from './confirm.modal';
import type { CreateEnvModalProps } from './create-env.modal';
import type { CreateScriptRunModalProps } from './create-script-run.modal';
import type { CreateScriptModalProps } from './create-script.modal';
import type { EditScriptModalProps } from './edit-script.modal';
import type { PreviewScriptModalProps } from './preview-script.modal';

/**
 * Type-safe modal ID constants using const object
 */
export const MODAL_IDS = {
  CONFIRM: 'confirm',
  CREATE_ENV: 'create-env',
  CREATE_SCRIPT_RUN: 'create-script-run',
  CREATE_SCRIPT: 'create-script',
  EDIT_SCRIPT: 'edit-script',
  PREVIEW_SCRIPT: 'preview-script',
} as const;

export type ModalId = typeof MODAL_IDS[keyof typeof MODAL_IDS];

/**
 * Type mapping of modal IDs to their expected data types
 */
export type ModalDataMap = {
  [MODAL_IDS.CONFIRM]: ConfirmModalProps;
  [MODAL_IDS.CREATE_ENV]: CreateEnvModalProps;
  [MODAL_IDS.CREATE_SCRIPT_RUN]: CreateScriptRunModalProps;
  [MODAL_IDS.CREATE_SCRIPT]: CreateScriptModalProps;
  [MODAL_IDS.EDIT_SCRIPT]: EditScriptModalProps;
  [MODAL_IDS.PREVIEW_SCRIPT]: PreviewScriptModalProps;
};

// eslint-disable-next-line react-refresh/only-export-components
export { showModal, registerModals } from './modal.utils';

export { ConfirmModal } from './confirm.modal';
export { CreateEnvModal } from './create-env.modal';
export { CreateScriptRunModal } from './create-script-run.modal';
export { CreateScriptModal } from './create-script.modal';
export { EditScriptModal } from './edit-script.modal';
export { PreviewScriptModal } from './preview-script.modal';

export type { ConfirmModalProps };
export type { CreateEnvModalProps };
export type { CreateScriptRunModalProps };
export type { CreateScriptModalProps };
export type { EditScriptModalProps };
export type { PreviewScriptModalProps };

