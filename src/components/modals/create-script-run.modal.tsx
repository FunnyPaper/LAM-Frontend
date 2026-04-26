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
import { useCallback, useContext, useMemo, useState } from 'react';
import type { ScriptDto } from '../../api/queries/script.provider';
import type { EnvDto } from '../../api/queries/env.provider';
import { ApiProvider } from 'lam-frontend/providers/api.provider';
import { ScriptsTable, type PaginationParams as ScriptsPaginationParams } from '../tables/script.table';
import { EnvsTable, type PaginationParams as EnvsPaginationParams } from '../tables/envs.table';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import type { ScriptVersionDto } from 'lam-frontend/api';
import {
  ScriptsVersionTable,
  type PaginationParams as ScriptVersionsPaginationParams,
} from '../tables/script-version.table';

export type CreateScriptRunModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { envId?: string; scriptVersionId: string }) => void;
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

export function CreateScriptRunModal({ open, onClose, onCreate }: CreateScriptRunModalProps) {
  const { t } = useTranslation('runs');
  const { script, scriptVersion, env } = useContext(ApiProvider)!;

  const [step, setStep] = useState(0);

  const [envsSearchParams, setEnvsSearchParams] = useState<EnvsPaginationParams>(defaultEnvsSearchParams);
  const [scriptsSearchParams, setScriptsSearchParams] = useState<ScriptsPaginationParams>(defaultScriptsSearchParams);
  const [scriptVersionsSearchParams, setScriptVersionsSearchParams] = useState<ScriptVersionsPaginationParams>(
    defaultScriptVersionSearchParams
  );

  const [selectedScript, setSelectedScript] = useState<ScriptDto | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<EnvDto | null>(null);
  const [selectedScriptVersion, setSelectedScriptVersion] = useState<ScriptVersionDto | null>(null);

  const getAllEnvsDataSource = useMemo(() => env.getAll(envsSearchParams), [env, envsSearchParams]);
  const getAllScriptsDataSource = useMemo(() => script.getAll(scriptsSearchParams), [script, scriptsSearchParams]);
  const getAllScriptVersionsDataSource = useMemo(
    () =>
      selectedScript &&
      scriptVersion.getAll(selectedScript?.id, {
        ...scriptVersionsSearchParams,
        filter: { status: 'Published' },
        sort: { field: 'versionNumber', order: 'desc' },
      }),
    [scriptVersion, scriptVersionsSearchParams, selectedScript]
  );

  const { data: envs, isLoading: isEnvsLoading } = useDataSourceHook(getAllEnvsDataSource);
  const { data: scripts, isLoading: isScriptsLoading } = useDataSourceHook(getAllScriptsDataSource);
  const { data: scriptVersions, isLoading: isScriptVersionsLoading } =
    useDataSourceHook(getAllScriptVersionsDataSource);

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
      onClose();
    }
  }, [onClose, onCreate, selectedEnv?.id, selectedScriptVersion]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('createModal.title')}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', width: 600, height: 400 }}>
        <Stack gap={2} sx={{ height: '100%' }}>
          <Stepper nonLinear activeStep={step} sx={{ [`&.${stepperClasses.horizontal}`]: { height: 64 } }}>
            <Step completed={completed[0]}>
              <StepLabel>Select script</StepLabel>
            </Step>
            <Step completed={completed[1]}>
              <StepLabel
                error={!selectedScript}
                {...(!selectedScript && {
                  optional: (
                    <Typography variant="subtitle2" color="error">
                      First select the script
                    </Typography>
                  ),
                })}
              >
                Select version
              </StepLabel>
            </Step>
            <Step completed={completed[2]}>
              <StepLabel optional>Select env</StepLabel>
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
            <Button onClick={handleBack}>Back</Button>
            <Stack direction="row" gap={2}>
              <Button onClick={handleNext}>Next</Button>
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
