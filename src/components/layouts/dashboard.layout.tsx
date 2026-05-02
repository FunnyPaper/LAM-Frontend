import {
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  type Theme,
  type CSSObject,
  Stack,
  drawerClasses,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ScriptsIcon from '@mui/icons-material/Description';
import RunsIcon from '@mui/icons-material/DoubleArrow';
import EnvsIcon from '@mui/icons-material/Inventory';
import { useState, type ReactNode } from 'react';
import { Link, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

const openedMixin = (theme: Theme): CSSObject => ({
  width: 240,
  justifyContent: 'space-between',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  justifyContent: 'space-between',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        justifyContent: 'flex-end',
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        justifyContent: 'center',
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const listItemProvider = (open: boolean, description: { text: string; path: string; icon: ReactNode }) => (
  <ListItem key={description.text} disablePadding disableGutters sx={{ display: 'block' }}>
    <Link to={description.path}>
      <ListItemButton
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          { justifyContent: open ? 'initial' : 'center' },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
            },
            { mr: open ? 3 : 'auto' },
          ]}
        >
          {description.icon}
        </ListItemIcon>
        <ListItemText primary={description.text} sx={{ opacity: open ? 1 : 0, color: 'text.primary' }} />
      </ListItemButton>
    </Link>
  </ListItem>
);

// TODO: Move all App bars in each page to be a part of this layout
// It happened that App bar is always a part of page inside this layout

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          position: 'relative',
          [`& .${drawerClasses.paper}`]: {
            position: 'absolute'
          }
        }}>
        <Stack>
          <DrawerHeader open={open}>
            <IconButton onClick={() => setOpen((open) => !open)}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List disablePadding>
            {[
              {
                text: t('profile:header'),
                path: '/profile',
                icon: <AccountIcon />,
              },
              {
                text: t('envs:header'),
                path: '/envs',
                icon: <EnvsIcon />,
              },
              {
                text: t('scripts:header'),
                path: '/scripts',
                icon: <ScriptsIcon />,
              },
              {
                text: t('runs:header'),
                path: '/runs',
                icon: <RunsIcon />,
              },
            ].map((element) => listItemProvider(open, element))}
          </List>
        </Stack>
        <Stack>
          <Divider />
          <List disablePadding sx={{ justifyContent: 'end' }}>
            {[
              {
                text: t('settings:header'),
                path: '/settings',
                icon: <SettingsIcon />,
              },
            ].map((element) => listItemProvider(open, element))}
          </List>
        </Stack>
      </Drawer>
      <Box component="main" minWidth={0} height="100%" width="100%">
        <Outlet />
      </Box>
    </Box>
  );
}
