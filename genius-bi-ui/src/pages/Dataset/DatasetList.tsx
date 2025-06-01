import React, { useState, useEffect } from 'react';
import { datasetsService } from '../../services';
import type { Dataset } from '../../types';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchDatasets = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await datasetsService.getDatasets(page);
      setDatasets(response.items);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
      setDatasets([]); // Reset datasets on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      try {
        await datasetsService.deleteDataset(id);
        fetchDatasets(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete dataset');
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchDatasets(value);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} gap={2}>
        <Typography variant="h4" component="h1">
          Datasets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/datasets/create'}
          fullWidth={isMobile}
        >
          Create New Dataset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">ID</TableCell>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="35%">Description</TableCell>
              <TableCell width="15%">Created At</TableCell>
              <TableCell width="25%" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets && datasets.length > 0 ? (
              datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>{dataset.id}</TableCell>
                  <TableCell>{dataset.name}</TableCell>
                  <TableCell sx={{ 
                    maxWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {dataset.description}
                  </TableCell>
                  <TableCell>{new Date(dataset.created_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => window.location.href = `/datasets/edit/${dataset.id}`}
                      size={isMobile ? "small" : "medium"}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(dataset.id)}
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No datasets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
}

export default DatasetList; 