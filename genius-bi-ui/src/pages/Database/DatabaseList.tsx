import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databasesService } from '../../services'; // Assuming a databasesService exists
import type { Database } from '../../types'; // Assuming a Database type exists - Uncommenting this import
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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Define a more detailed Database interface locally with all needed properties - Removing this local definition
// interface Database {
//   id: number;
//   name: string;
//   type: string;
//   jdbc_str: string;
//   version: string;
//   user: string;
//   password?: string; // Password might not be displayed in list, but include for completeness
//   description: string;
// }

function DatabaseList() {
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchDatabases = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      // Assuming databasesService has a getDatabases method that supports pagination
      // and returns data in the format { items: [], pages: 0, page: 0 }
      const response = await databasesService.getDatabases(page);
      setDatabases(response.items);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      // console.error('Error fetching databases:', err); // Removed console.log
      setError(err instanceof Error ? err.message : 'Failed to fetch databases');
      setDatabases([]); // Reset databases on error
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this database connection?')) {
      try {
        // Assuming databasesService has a deleteDatabase method
        await databasesService.deleteDatabase(id);
        fetchDatabases(currentPage); // Refresh list after deletion
      } catch (err) {
        // console.error('Error deleting database:', err); // Removed console.log
        setError(err instanceof Error ? err.message : 'Failed to delete database');
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchDatabases(value);
  };

  const handleEdit = (id: number) => {
    // Assuming the edit route is /databases/:id/edit
    navigate(`/databases/edit/${id}`);
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
          Database Connections
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/databases/create')} // Assuming the create route is /database/create
          fullWidth={isMobile}
        >
          Create New Connection
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
              <TableCell width="15%">Type</TableCell>
              <TableCell width="15%">JDBC String</TableCell>
              <TableCell width="15%">Version</TableCell>
              <TableCell width="15%">User</TableCell>
              {/* <TableCell>Password</TableCell> This should not be displayed in list */}
              <TableCell width="15%">Created At</TableCell>
              <TableCell width="30%" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {databases && databases.length > 0 ? (
              databases.map((database) => (
                <TableRow key={database.id}>
                  <TableCell>{database.id}</TableCell>
                  <TableCell>{database.name}</TableCell>
                  <TableCell>{database.type}</TableCell>
                  <TableCell>{database.jdbc_str}</TableCell>
                  <TableCell>{database.version}</TableCell>
                  <TableCell>{database.user}</TableCell>
                  <TableCell>{new Date(database.created_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(database.id)}
                      size={isMobile ? "small" : "medium"}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(database.id)}
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No database connections found
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

export default DatabaseList; 