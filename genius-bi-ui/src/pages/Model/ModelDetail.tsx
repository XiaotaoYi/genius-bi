import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { modelsService } from '../../services';
import type { Model, ModelDimension, ModelMetric } from '../../types';
import DimensionList from './DimensionList';
import MetricList from './MetricList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ModelDetail() {
  const { modelId } = useParams<{ modelId: string }>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [model, setModel] = useState<Model | null>(null);
  const [dimensions, setDimensions] = useState<ModelDimension[]>([]);
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchModelDetails = useCallback(async () => {
    if (!modelId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch model details
      const modelResponse = await modelsService.getModel(parseInt(modelId));
      setModel(modelResponse.data);
      
      // Fetch dimensions
      const dimensionsResponse = await modelsService.getModelDimensions(parseInt(modelId));
      setDimensions(dimensionsResponse.items);
      
      // Fetch metrics
      const metricsResponse = await modelsService.getModelMetrics(parseInt(modelId));
      setMetrics(metricsResponse.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch model details');
    } finally {
      setIsLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!model) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Model not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {model.model_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Database: {model.database_name} | Table: {model.table_name}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="model tabs"
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="Dimensions" />
          <Tab label="Metrics" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <DimensionList dimensions={dimensions} modelId={parseInt(modelId!)} onRefresh={fetchModelDetails}/>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <MetricList metrics={metrics} modelId={parseInt(modelId!)} onRefresh={fetchModelDetails}/>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default ModelDetail; 