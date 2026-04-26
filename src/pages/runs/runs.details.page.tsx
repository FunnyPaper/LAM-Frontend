// TODO: Update state changes in effect - maybe zustand or simple reducer will do the trick
/* eslint-disable react-hooks/set-state-in-effect */
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { useParams, useNavigate } from 'react-router';
import {
  ScriptRunStatuses,
  type ScriptRunResultDto,
  type ScriptRunStatus,
} from '../../api/queries/script-run.provider.dto';
import { Stop, Delete, ArrowBack } from '@mui/icons-material';
import type { ScriptRunEventDto } from '../../api/queries/script-run-event.provider.dto';
import { EnvsSnapshotPanel } from 'lam-frontend/components/panels/runs/env-snapshot.panel';
import { EventsPanel } from 'lam-frontend/components/panels/runs/events.panel';
import { ResultsPanel } from 'lam-frontend/components/panels/runs/results.panel';
import { ScriptRunGeneralInfoPanel } from 'lam-frontend/components/panels/runs/script-run-general-info.panel';
import { ScriptVersionSnapshotPanel } from 'lam-frontend/components/panels/runs/script-version-snapshot.panel';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { ScriptVersionStatuses, type ScriptVersionStatus } from 'lam-frontend/api/queries/script-version.provider';
import { getRunStatusColor } from 'lam-frontend/utils/colors';

export function RunsDetailsPage() {
  const { t: tRuns } = useTranslation('runs');
  const { t: tScripts } = useTranslation('scripts');
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { scriptRun, scriptRunEvent } = useContext(ApiProvider)!;

  const [scriptRunEvents, setScriptRunEvents] = useState<ScriptRunEventDto[]>([]);
  const [resultData, setResultData] = useState<ScriptRunResultDto>();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ScriptRunStatus>('Unknown');

  const scriptRunResource = useMemo(() => scriptRun.getOne(id!), [id, scriptRun]);
  const {
    data: scriptRunData,
    isLoading: isScriptRunLoading,
    error: scriptRunError,
    invalidate: invalidateScriptRun,
  } = useDataSourceHook(scriptRunResource);

  const scriptRunEventResource = useMemo(() => scriptRunEvent.getOne(id!), [id, scriptRunEvent]);
  const { data: scriptRunEventData, invalidate: invalidateScriptRunEvent } = useDataSourceHook(scriptRunEventResource, {
    enabled: isRunning,
  });
  useEffect(() => {
    if (!scriptRunEventData) return;

    setScriptRunEvents((prev) => [...prev, scriptRunEventData]);
  }, [setScriptRunEvents, scriptRunEventData]);

  useEffect(() => {
    if (scriptRunData?.result) {
      setResultData(scriptRunData.result);
    }
  }, [setResultData, scriptRunData?.result]);

  useEffect(() => {
    if (scriptRunEventData?.type == 'resultUpdate') {
      if (scriptRunEventData.change.type == 'partial') {
        setResultData((prev) => {
          if (!prev) return scriptRunEventData.change.data;
          return { ...prev, data: { ...prev.data, ...scriptRunEventData.change.data } };
        });
      } else if (scriptRunEventData.change.type == 'full') {
        setResultData((prev) => {
          if (!prev) return scriptRunEventData.change.data;
          return { ...prev, data: scriptRunEventData.change.data };
        });
      }
    }
  }, [scriptRunEventData, setResultData]);

  useEffect(() => {
    if (scriptRunData) {
      setCurrentStatus(scriptRunData?.status);
      setIsRunning(scriptRunData?.status === 'Running' || scriptRunData?.status === 'Queued');
    }
  }, [scriptRunData, setCurrentStatus, setIsRunning]);

  useEffect(() => {
    if (scriptRunEventData?.type == 'status') {
      setCurrentStatus(scriptRunEventData.status);
      setIsRunning(scriptRunEventData.status === 'Running' || scriptRunEventData.status === 'Queued');
    }
  }, [scriptRunEventData, setCurrentStatus, setIsRunning]);

  const limitedEvents = useMemo(() => scriptRunEvents.slice(-100), [scriptRunEvents]);
  const handleBackToList = useCallback(() => navigate('/runs', { replace: true }), [navigate]);

  const handleStop = async () => {
    await scriptRun.cancel(id!);

    invalidateScriptRunEvent();
    invalidateScriptRun();
  };

  const handleRemove = async () => {
    await scriptRun.remove(id!);
    handleBackToList();
  };

  if (isScriptRunLoading) {
    return <CircularProgress />;
  }

  if (scriptRunError || !scriptRunData) {
    return (
      <Box p={2} height="100%" width="100%">
        <Typography variant="h4" color="error">
          {scriptRunError || tRuns('notFound')}
        </Typography>
        <Button onClick={() => navigate('/runs', { replace: true })} sx={{ mt: 2 }}>
          {tRuns('backToList')}
        </Button>
      </Box>
    );
  }

  const isFinished =
    ScriptRunStatuses.includes(currentStatus) &&
    (currentStatus === 'Succeeded' || currentStatus === 'Failed' || currentStatus === 'Cancelled');

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <AppBar
        position="relative"
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={handleBackToList}
          >
            <ArrowBack />
          </Button>
          <Typography variant="h4">{tRuns('details.header')}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={tRuns(`status.${currentStatus.toLowerCase()}`)}
              size="small"
              variant="outlined"
              color={getRunStatusColor(currentStatus)}
            />
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          {isRunning && (
            <Button variant="outlined" color="secondary" startIcon={<Stop />} onClick={handleStop}>
              {tRuns('details.stop')}
            </Button>
          )}
          {isFinished && (
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleRemove}>
              {tRuns('details.remove')}
            </Button>
          )}
        </Stack>
      </AppBar>
      <Box p={2} flexGrow={1} overflow="auto" display="flex" flexDirection="column">
        <Stack spacing={2} flexGrow={1} overflow="auto">
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ScriptRunGeneralInfoPanel
                isMobile={isMobile}
                scriptRunData={scriptRunData}
                labels={{
                  generalInfo: tRuns('details.generalInfo'),
                  id: tRuns('details.id'),
                  environment: tRuns('details.environment'),
                  createdAt: tRuns('details.createdAt'),
                  updatedAt: tRuns('details.updatedAt'),
                  finishedAt: tRuns('details.finishedAt'),
                }}
              />

              <ScriptVersionSnapshotPanel
                isMobile={isMobile}
                scriptRunData={scriptRunData}
                labels={Object.assign(
                  {
                    scriptVersionSnapshot: tRuns('details.scriptVersionSnapshot'),
                    cachedData: tRuns('details.cachedData'),
                    versionNumber: tRuns('details.versionNumber'),
                    status: tRuns('details.status'),
                    content: tRuns('details.content'),
                  },
                  Object.fromEntries(
                    ScriptVersionStatuses.map((s) => [s.toLowerCase(), tScripts(`version.status.${s.toLowerCase()}`)])
                  ) as Record<Lowercase<ScriptVersionStatus>, string>
                )}
              />

              <EnvsSnapshotPanel
                scriptRunData={scriptRunData}
                labels={{
                  envSnapshot: tRuns('details.envSnapshot'),
                  cachedData: tRuns('details.cachedData'),
                  name: tRuns('details.name'),
                  data: tRuns('details.data'),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <EventsPanel
                truncated={scriptRunEvents.length > 100}
                events={limitedEvents}
                labels={Object.assign(
                  {
                    events: tRuns('details.events'),
                    description: tRuns('details.eventsDescription'),
                    truncated: tRuns('details.eventsTruncated'),
                    noEvents: tRuns('details.noEvents'),
                  },
                  Object.fromEntries(
                    ScriptRunStatuses.map((s) => [s.toLowerCase(), tRuns(`status.${s.toLowerCase()}`)])
                  ) as Record<Lowercase<ScriptRunStatus>, string>
                )}
              />

              <ResultsPanel
                runId={id!}
                resultData={resultData}
                labels={{
                  result: tRuns('details.result'),
                  description: tRuns('details.resultDescription'),
                  data: tRuns('details.resultData'),
                  download: tRuns('download'),
                  noResult: tRuns('details.noResult'),
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
