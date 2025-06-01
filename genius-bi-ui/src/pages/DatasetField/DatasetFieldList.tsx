import React, { useState, useEffect } from 'react';
import { datasetFieldsService } from '../../services';
import type { DatasetField } from '../../types';
import {
  Container,
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
  Pagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function DatasetFieldList() {
  const [datasetFields, setDatasetFields] = useState<DatasetField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDatasetFields = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await datasetFieldsService.getDatasetFields(page);
      setDatasetFields(response.items);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dataset fields');
      setDatasetFields([]); // Reset dataset fields on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetFields();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dataset field?')) {
      try {
        await datasetFieldsService.deleteDatasetField(id);
        fetchDatasetFields(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete dataset field');
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchDatasetFields(value);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dataset Fields
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/dataset-fields/create'}
        >
          Create New Dataset Field
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Dataset ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasetFields && datasetFields.length > 0 ? (
              datasetFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>{field.id}</TableCell>
                  <TableCell>{field.dataset_id}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.description}</TableCell>
                  <TableCell>{field.field_type}</TableCell>
                  <TableCell>{new Date(field.created_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => window.location.href = `/dataset-fields/edit/${field.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(field.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No dataset fields found
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
          />
        </Box>
      )}
    </Container>
  );
}

export default DatasetFieldList; 