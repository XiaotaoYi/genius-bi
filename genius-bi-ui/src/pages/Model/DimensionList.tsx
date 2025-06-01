import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { ModelDimension } from '../../types';

interface DimensionListProps {
  dimensions: ModelDimension[];
  modelId: number;
  onRefresh: () => void;
}

function DimensionList({ dimensions, modelId, onRefresh }: DimensionListProps) {
  const navigate = useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dimension?')) {
      try {
        // TODO: Implement delete dimension API call
        onRefresh();
      } catch (err) {
        console.error('Failed to delete dimension:', err);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Dimensions</Typography>
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
            {dimensions.length > 0 ? (
              dimensions.map((dimension) => (
                <TableRow key={dimension.id}>
                  <TableCell>{dimension.name}</TableCell>
                  <TableCell>{dimension.alias}</TableCell>
                  <TableCell>{dimension.dimension_type}</TableCell>
                  <TableCell>{dimension.description}</TableCell>
                  <TableCell>{dimension.express}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      onClick={() => navigate(`/dimensions/edit/${dimension.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(dimension.id)}
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
                  No dimensions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DimensionList; 