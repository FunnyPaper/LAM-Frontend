import NiceModal from '@ebay/nice-modal-react';
import type { ModalId, ModalDataMap } from './modal.definitions';
import { MODAL_IDS } from './modal.definitions';
import { ConfirmModal } from './confirm.modal';
import { CreateEnvModal } from './create-env.modal';
import { CreateScriptRunModal } from './create-script-run.modal';
import { CreateScriptModal } from './create-script.modal';
import { EditScriptModal } from './edit-script.modal';
import { PreviewScriptModal } from './preview-script.modal';

/**
 * Type-safe modal show helper
 * @param id Id of the modal to show
 * @param data Data associated with modal
 */
export function showModal<K extends ModalId>(id: K, data: ModalDataMap[K]): void {
  NiceModal.show(id, data);
}

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
