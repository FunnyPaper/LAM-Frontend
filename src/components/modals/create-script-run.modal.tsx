import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  stepperClasses,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import type { ScriptDto } from '../../api/queries/script.provider';
import type { EnvDto, GetEnsProviderParams } from '../../api/queries/env.provider';
import type { Paginated } from '../../api/queries/paginated.provider';
import type { DataSource } from '../../api/resources/datasource';
import type { ScriptVersionDto, GetScriptVersionsProviderParams } from '../../api/queries/script-version.provider';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { ScriptsTable, type PaginationParams as ScriptsPaginationParams } from '../tables/script.table';
import { EnvsTable, type PaginationParams as EnvsPaginationParams } from '../tables/envs.table';
import {
  ScriptsVersionTable,
  type PaginationParams as ScriptVersionsPaginationParams,
} from '../tables/script-version.table';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export type CreateScriptRunModalProps = {
  onCreate: (data: { envId?: string; scriptVersionId: string }) => void;
  getEnvsDataSourceFactory: ((params?: GetEnsProviderParams) => DataSource<Paginated<EnvDto>>) | null;
  getScriptsDataSourceFactory: ((params?: {
    page?: number;
    limit?: number;
    filter?: {
      name?: string;
    };
    sort?: {
      field?: 'name' | 'createdAt' | 'updatedAt';
      order?: 'asc' | 'desc';
    };
    include?: ('versions' | 'runs')[];
  }) => DataSource<Paginated<ScriptDto>>) | null;
  getScriptVersionsDataSourceFactory: ((scriptId: string, params?: GetScriptVersionsProviderParams) => DataSource<Paginated<ScriptVersionDto>>) | null;
};

const defaultEnvsSearchParams: EnvsPaginationParams = {
  page: 0,
  limit: 10,
};

const defaultScriptsSearchParams: ScriptsPaginationParams = {
  page: 0,
  limit: 10,
};

const defaultScriptVersionSearchParams: ScriptVersionsPaginationParams = {
  page: 0,
  limit: 10,
};

function CreateScriptRunModalInner({
  onCreate,
  getEnvsDataSourceFactory,
  getScriptsDataSourceFactory,
  getScriptVersionsDataSourceFactory,
}: CreateScriptRunModalProps) {
  const { t } = useTranslation('runs');
  const modal = useModal();

  const [step, setStep] = useState(0);

  const [envsSearchParams, setEnvsSearchParams] = useState<EnvsPaginationParams>(defaultEnvsSearchParams);
  const [scriptsSearchParams, setScriptsSearchParams] = useState<ScriptsPaginationParams>(defaultScriptsSearchParams);
  const [scriptVersionsSearchParams, setScriptVersionsSearchParams] = useState<ScriptVersionsPaginationParams>(
    defaultScriptVersionSearchParams
  );

  const [selectedScript, setSelectedScript] = useState<ScriptDto | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<EnvDto | null>(null);
  const [selectedScriptVersion, setSelectedScriptVersion] = useState<ScriptVersionDto | null>(null);

  const envsDatasource = useMemo(() => {
    if (!getEnvsDataSourceFactory) return null;
    return getEnvsDataSourceFactory({
      page: envsSearchParams.page,
      limit: envsSearchParams.limit,
    });
  }, [getEnvsDataSourceFactory, envsSearchParams]);

  const scriptsDatasource = useMemo(() => {
    if (!getScriptsDataSourceFactory) return null;
    return getScriptsDataSourceFactory({
      page: scriptsSearchParams.page,
      limit: scriptsSearchParams.limit,
    });
  }, [getScriptsDataSourceFactory, scriptsSearchParams]);

  const scriptVersionsDatasource = useMemo(() => {
    if (!selectedScript || !getScriptVersionsDataSourceFactory) return null;
    return getScriptVersionsDataSourceFactory(selectedScript.id, {
      page: scriptVersionsSearchParams.page,
      limit: scriptVersionsSearchParams.limit,
      filter: { status: 'Published' },
      sort: { field: 'versionNumber', order: 'desc' },
    });
  }, [getScriptVersionsDataSourceFactory, selectedScript, scriptVersionsSearchParams]);

  const { data: envs, isLoading: isEnvsLoading } = useDataSourceHook(envsDatasource);
  const { data: scripts, isLoading: isScriptsLoading } = useDataSourceHook(scriptsDatasource);
  const { data: scriptVersions, isLoading: isScriptVersionsLoading } =
    useDataSourceHook(scriptVersionsDatasource);

  const completed = useMemo(
    () => ({
      0: !!selectedScript,
      1: !!selectedScriptVersion,
      2: !!selectedEnv,
    }),
    [selectedEnv, selectedScript, selectedScriptVersion]
  );

  const handleNext = useCallback(() => {
    let newStep = (step + 1) % 3;

    if (newStep == 1 && !selectedScript) {
      newStep = (newStep + 1) % 3;
    }

    setStep(newStep);
  }, [selectedScript, step]);

  const handleBack = useCallback(() => {
    let newStep = (((step - 1) % 3) + 3) % 3;

    if (newStep == 1 && !selectedScript) {
      newStep = (((newStep - 1) % 3) + 3) % 3;
    }

    setStep(newStep);
  }, [selectedScript, step]);

  const handleRun = useCallback(() => {
    if (selectedScriptVersion) {
      onCreate({
        envId: selectedEnv?.id,
        scriptVersionId: selectedScriptVersion.id,
      });
      setSelectedEnv(null);
      setSelectedScript(null);
      setSelectedScriptVersion(null);
      modal.remove();
    }
  }, [modal, onCreate, selectedEnv?.id, selectedScriptVersion]);

  return (
    <Dialog open onClose={modal.remove}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('createModal.title')}</Typography>
          <IconButton onClick={modal.remove}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', width: 600, height: 400 }}>
        <Stack gap={2} sx={{ height: '100%' }}>
          <Stepper nonLinear activeStep={step} sx={{ [`&.${stepperClasses.horizontal}`]: { height: 64 } }}>
            <Step completed={completed[0]}>
              <StepLabel>{t('createModal.steps.selectScript')}</StepLabel>
            </Step>
            <Step completed={completed[1]}>
              <StepLabel
                error={!selectedScript}
                {...(!selectedScript && {
                  optional: (
                    <Typography variant="subtitle2" color="error">
                      {t('createModal.steps.firstSelectScript')}
                    </Typography>
                  ),
                })}
              >
                {t('createModal.steps.selectVersion')}
              </StepLabel>
            </Step>
            <Step completed={completed[2]}>
              <StepLabel optional>{t('createModal.steps.selectEnv')}</StepLabel>
            </Step>
          </Stepper>
          {step === 0 && (
            <ScriptsTable
              isLoading={isScriptsLoading}
              scripts={scripts}
              selectedScript={selectedScript}
              onSelectScript={setSelectedScript}
              searchParams={scriptsSearchParams}
              onSearchParamsChange={setScriptsSearchParams}
            />
          )}
          {step === 1 && (
            <ScriptsVersionTable
              isLoading={isScriptVersionsLoading}
              scriptVersions={scriptVersions}
              selectedScriptVersion={selectedScriptVersion}
              onSelectScriptVersion={setSelectedScriptVersion}
              searchParams={scriptVersionsSearchParams}
              onSearchParamsChange={setScriptVersionsSearchParams}
            />
          )}
          {step === 2 && (
            <EnvsTable
              isLoading={isEnvsLoading}
              envs={envs}
              selectedEnv={selectedEnv}
              onSelectEnv={setSelectedEnv}
              searchParams={envsSearchParams}
              onSearchParamsChange={setEnvsSearchParams}
            />
          )}
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={handleBack}>{t('createModal.back')}</Button>
            <Stack direction="row" gap={2}>
              <Button onClick={handleNext}>{t('createModal.next')}</Button>
              <Button onClick={handleRun} variant="contained" disabled={!selectedScriptVersion}>
                {t('createModal.run')}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export const CreateScriptRunModal = NiceModal.create(CreateScriptRunModalInner);
