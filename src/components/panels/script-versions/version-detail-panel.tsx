import type { ScriptVersionDto } from 'lam-frontend/api';
import type { ViewType } from 'lam-frontend/components/modals/preview-script.modal';
import { PreviewScriptVersionPanel } from './preview-script-version.panel';
import { PublishScriptVersionPanel } from './publish-script-version.panel';
import { ForkScriptVersionPanel } from './fork-script-version.panel';
import { EditScriptVersionPanel } from './edit-script-version.panel';
import { RemoveScriptVersionPanel } from './remove-script-version.panel';
import { ArchiveScriptVersionPanel } from './archive-script-version.panel';

export type ValidationLabels = {
  required: string;
  minLength: (num: number) => string;
  maxLength: (num: number) => string;
};

export type VersionLabels = {
  confirm?: string;
  name?: string;
  validation?: ValidationLabels;
};

export type VersionDetailPanelHeaders = Partial<Record<ViewType, string>>;
export type VersionDetailPanelInfos = Partial<Record<ViewType, string>>;
export type VersionDetailPanelLabels = Partial<Record<ViewType, VersionLabels>>;

export type VersionDetailPanelProps = {
  selectedView: ViewType;
  selectedVersion: ScriptVersionDto;
  headers?: VersionDetailPanelHeaders;
  infos?: VersionDetailPanelInfos;
  onEdit: (version: ScriptVersionDto) => void;
  onArchive: (version: ScriptVersionDto) => Promise<void>;
  onPublish: (version: ScriptVersionDto, data: { name: string }) => Promise<void>;
  onRemove: (version: ScriptVersionDto) => Promise<void>;
  onFork: (version: ScriptVersionDto) => Promise<void>;
  labels?: VersionDetailPanelLabels;
};

export function VersionDetailPanel({
  selectedView,
  selectedVersion,
  headers,
  infos,
  onEdit,
  onArchive,
  onPublish,
  onRemove,
  onFork,
  labels,
}: VersionDetailPanelProps) {
  const header = headers?.[selectedView] ?? '';
  const info = infos?.[selectedView] ?? '';
  const viewLabels = labels?.[selectedView];
  const confirmLabel = viewLabels?.confirm;
  const nameLabel = viewLabels?.name;
  const validationLabels = viewLabels?.validation;

  switch (selectedView) {
    case 'view':
      return (
        <PreviewScriptVersionPanel
          content={JSON.stringify(selectedVersion.content.astJson, null, 2)}
        />
      );
    case 'publish':
      return (
        <PublishScriptVersionPanel
          header={header}
          info={info}
          scriptVersion={selectedVersion}
          onPublish={onPublish}
          labels={{
            confirm: confirmLabel ?? '',
            name: nameLabel ?? '',
            validation: validationLabels ?? {
              required: '',
              minLength: (n) => '',
              maxLength: (n) => '',
            },
          }}
        />
      );
    case 'fork':
      return (
        <ForkScriptVersionPanel
          header={header}
          info={info}
          scriptVersion={selectedVersion}
          onFork={onFork}
          labels={{ confirm: confirmLabel ?? '' }}
        />
      );
    case 'edit':
      return (
        <EditScriptVersionPanel
          header={header}
          info={info}
          scriptVersion={selectedVersion}
          onEdit={onEdit}
          labels={{ confirm: confirmLabel ?? '' }}
        />
      );
    case 'delete':
      return (
        <RemoveScriptVersionPanel
          header={header}
          info={info}
          scriptVersion={selectedVersion}
          onRemove={onRemove}
          labels={{ confirm: confirmLabel ?? '' }}
        />
      );
    case 'archive':
      return (
        <ArchiveScriptVersionPanel
          header={header}
          info={info}
          scriptVersion={selectedVersion}
          onArchive={onArchive}
          labels={{ confirm: confirmLabel ?? '' }}
        />
      );
  }
}