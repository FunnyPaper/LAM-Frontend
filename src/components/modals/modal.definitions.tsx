import NiceModal from '@ebay/nice-modal-react';
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

/**
 * Type-safe modal show helper
 * @param id Id of the modal to show
 * @param data Data associated with modal
 */
export function showModal<K extends ModalId>(id: K, data: ModalDataMap[K]): void {
  NiceModal.show(id, data);
}

import { ConfirmModal } from './confirm.modal';
import { CreateEnvModal } from './create-env.modal';
import { CreateScriptRunModal } from './create-script-run.modal';
import { CreateScriptModal } from './create-script.modal';
import { EditScriptModal } from './edit-script.modal';
import { PreviewScriptModal } from './preview-script.modal';

/**
 * Register all modals with their types. 
 * This function should be called once at the app entry point.
 */
export function registerModals() {
  NiceModal.register(MODAL_IDS.CONFIRM, ConfirmModal);
  NiceModal.register(MODAL_IDS.CREATE_ENV, CreateEnvModal);
  NiceModal.register(MODAL_IDS.CREATE_SCRIPT_RUN, CreateScriptRunModal);
  NiceModal.register(MODAL_IDS.CREATE_SCRIPT, CreateScriptModal);
  NiceModal.register(MODAL_IDS.EDIT_SCRIPT, EditScriptModal);
  NiceModal.register(MODAL_IDS.PREVIEW_SCRIPT, PreviewScriptModal);
}

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

