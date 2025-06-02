import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Container,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Storage as DatabaseIcon,
  DataObject as DatasetIcon,
  Category as DimensionIcon,
  Speed as MetricIcon,
  Psychology as LLMIcon,
  SmartToy as AnalysisAssistantIcon,
  ShowChart as IndexMarketIcon,
  People as UserIcon,
  Security as PermissionIcon,
  Settings as SettingsIcon,
  Translate as TerminologyIcon,
  ModelTraining as ModelIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Schema as SchemaIcon
} from '@mui/icons-material';

const menuItems = [
  { text: 'Chat', path: '/chats', icon: <DashboardIcon /> },
  { text: 'Assistant', path: '/analysis-assistants', icon: <AnalysisAssistantIcon /> },
  { 
    text: 'Semantic',
    startIcon: <SchemaIcon />,
    endIcon: <ArrowDropDownIcon />,
    subItems: [
      { text: 'Dataset', path: '/datasets', icon: <DatasetIcon /> },
      { text: 'Model', path: '/models', icon: <ModelIcon /> },
      { text: 'Term', path: '/terms', icon: <TerminologyIcon /> },
    ]
  },
  { text: 'LLM', path: '/llms', icon: <LLMIcon /> },
  { text: 'DB Connection', path: '/databases', icon: <DatabaseIcon /> }
];

function Layout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const location = useLocation();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            Genius BI
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            {menuItems.map((item) => (
              item.subItems ? (
                <React.Fragment key={item.text}>
                  <Button
                    color="inherit"
                    onClick={handleMenuClick}
                    endIcon={item.endIcon}
                    startIcon={item.startIcon}
                  >
                    {item.text}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    {item.subItems.map((subItem) => (
                      <MenuItem
                        key={subItem.text}
                        component={NavLink}
                        to={subItem.path}
                        onClick={handleMenuClose}
                        selected={location.pathname.startsWith(subItem.path)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {subItem.icon}
                          {subItem.text}
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </React.Fragment>
              ) : (
                <Button
                  key={item.text}
                  color="inherit"
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    '&.active': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              )
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pl: 0,
          mt: '64px', // Height of AppBar
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Layout; 