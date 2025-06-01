import React, { useState, useEffect } from 'react';
import { llmsService } from '../../services';
import type { LLM } from '../../types';
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
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function LLMList() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchLLMs = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await llmsService.getLLMs(page);
      setLLMs(response.items);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch LLMs');
      setLLMs([]); // Reset LLMs on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLLMs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this LLM?')) {
      try {
        await llmsService.deleteLLM(id);
        fetchLLMs(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete LLM');
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchLLMs(value);
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
          LLMs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/llms/create'}
          fullWidth={isMobile}
        >
          Create New LLM
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
              <TableCell width="20%">Connection Name</TableCell>
              <TableCell width="15%">API Protocol</TableCell>
              <TableCell width="15%">Model Name</TableCell>
              <TableCell width="25%">Description</TableCell>
              <TableCell width="10%">Created At</TableCell>
              <TableCell width="10%" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {llms && llms.length > 0 ? (
              llms.map((llm) => (
                <TableRow key={llm.id}>
                  <TableCell>{llm.id}</TableCell>
                  <TableCell>{llm.connection_name}</TableCell>
                  <TableCell>{llm.api_protocal}</TableCell>
                  <TableCell>{llm.model_name}</TableCell>
                  <TableCell sx={{ 
                    maxWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {llm.description}
                  </TableCell>
                  <TableCell>{new Date(llm.create_time || '').toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => window.location.href = `/llms/edit/${llm.id}`}
                      size={isMobile ? "small" : "medium"}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(llm.id)}
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No LLMs found
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

export default LLMList; 