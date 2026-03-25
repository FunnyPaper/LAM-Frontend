import { Card, CardHeader, CardContent, Box, Typography, Chip } from '@mui/material';
import { format } from 'date-fns';
import type { ScriptRunEventDto } from 'lam-frontend/api/queries/script-run-event.provider.dto';
import type { ScriptRunStatus } from 'lam-frontend/api/queries/script-run.provider.dto';
import { getStatusColor } from 'lam-frontend/utils/colors';

export type EventsPanelProps = {
  truncated: boolean;
  events: ScriptRunEventDto[];
  labels: {
    events: string;
    description: string;
    truncated: string;
    noEvents: string;
  } & Record<Lowercase<ScriptRunStatus>, string>;
};

export function EventsPanel({ truncated, events, labels }: EventsPanelProps) {
  return (
    <Card>
      <CardHeader title={labels.events} subheader={labels.description} />
      <CardContent>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            height: 400,
            overflow: 'auto',
          }}
        >
          {truncated && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {labels.truncated}
            </Typography>
          )}
          {events.length === 0 ? (
            <Typography>{labels.noEvents}</Typography>
          ) : (
            events.map((event, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  {event.type.toUpperCase()} - {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
                {event.type === 'status' && (
                  <Chip
                    label={labels[event.status.toLowerCase() as Lowercase<ScriptRunStatus>]}
                    size="small"
                    variant="outlined"
                    color={getStatusColor(event.status)}
                  />
                )}
                {event.type === 'log' && (
                  <Typography
                    variant="body2"
                    color={
                      event.log.type === 'error' ? 'error' : event.log.type === 'warn' ? 'warning' : 'text.primary'
                    }
                  >
                    {event.log.message}
                  </Typography>
                )}
                {event.type === 'resultUpdate' && (
                  <Typography variant="body2" component="pre">
                    {JSON.stringify(event.change.data, null, 2)}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
