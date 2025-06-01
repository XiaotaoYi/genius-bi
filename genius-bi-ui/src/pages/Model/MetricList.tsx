import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { ModelMetric } from '../../types';
import { useNavigate } from 'react-router-dom';


interface MetricListProps {
  metrics: ModelMetric[];
  modelId: number;
  onRefresh: () => void;
}

function MetricList({ metrics, modelId, onRefresh }: MetricListProps) {
  const navigate = useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      try {
        // TODO: Implement delete metric API call
        onRefresh();
      } catch (err) {
        console.error('Failed to delete metric:', err);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Metrics</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Alias</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Expression</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.length > 0 ? (
              metrics.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell>{metric.name}</TableCell>
                  <TableCell>{metric.alias}</TableCell>
                  <TableCell>{metric.metric_type}</TableCell>
                  <TableCell>{metric.description}</TableCell>
                  <TableCell>{metric.express}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      onClick={() => navigate(`/metrics/edit/${metric.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(metric.id)}
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No metrics found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MetricList; 