import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import type { ChatAssistant, AnalysisAssistant,ChatAssistantQuery } from '../../types'; // Import types from index
import { chatAssistantsService, analysisAssistantsService } from '../../services'; // Import services from index

// Define a simple message type for mock messages
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'assistant';
}

function ChatList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for chat list and selection
  const [chatAssistants, setChatAssistants] = useState<ChatAssistant[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // State for "Create New Chat" dialog
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatDescription, setNewChatDescription] = useState('');
  const [analysisAssistants, setAnalysisAssistants] = useState<AnalysisAssistant[]>([]);
  const [selectedAnalysisAssistantId, setSelectedAnalysisAssistantId] = useState<number | ''>('');

  // State for chat window (using mock data for messages for now)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data (chat assistants and analysis assistants)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch chat assistants
        const chatResponse = await chatAssistantsService.getChatAssistants(1, 100); // Fetch a reasonable number
        setChatAssistants(chatResponse.items);

        // Fetch analysis assistants for the dropdown
        const analysisResponse = await analysisAssistantsService.getAnalysisAssistants(1, 1000); // Fetch all or paginate if many
        setAnalysisAssistants(analysisResponse.items);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Failed to fetch initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Handle chat selection
  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
    // In a real app, you would fetch messages for this chat here
    // For now, clear and add a placeholder message
    setMessages([
        { id: 1, text: `You selected chat ${chatId}. Start typing!`, sender: 'assistant' }
    ]);
    setNewMessageText(''); // Clear input field
  };

  // Handle opening the new chat dialog
  const handleOpenNewChatDialog = () => {
    setNewChatDialogOpen(true);
    // Reset form fields
    setNewChatName('');
    setNewChatDescription('');
    setSelectedAnalysisAssistantId('');
    setError(null); // Clear any previous errors
  };

  // Handle closing the new chat dialog
  const handleCloseNewChatDialog = () => {
    setNewChatDialogOpen(false);
  };

  // Handle creating a new chat
  const handleCreateNewChat = async () => {
    if (!newChatName || !selectedAnalysisAssistantId) {
      setError('Name and Analysis Assistant are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newChat = await chatAssistantsService.createChatAssistant({
        chat_name: newChatName,
        chat_description: newChatDescription,
        analysis_assistant_id: Number(selectedAnalysisAssistantId),
        // create_by would typically come from user context, not manual input
        // For this example, omitting create_by or setting a default might be necessary
      });
      setChatAssistants([...chatAssistants, newChat]);
      handleCloseNewChatDialog(); // Close dialog on success
      handleChatSelect(newChat.id); // Automatically select the new chat
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat assistant');
      console.error('Failed to create chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!newMessageText.trim() || !selectedChatId) {
            return; // Don't send empty messages or if no chat is selected
        }

        const userMessage: Message = {
            id: messages.length + 1, // Simple ID generation
            text: newMessageText,
            sender: 'user',
        };

        // Optimistically add the user's message
        setMessages([...messages, userMessage]);
        setNewMessageText(''); // Clear input immediately

        setIsLoading(true); // Indicate sending state
        setError(null); // Clear errors

        try {
            // Call the backend parsing endpoint
            // Note: The backend currently ignores the query and chat ID.
            // A real implementation needs to be updated to process the message,
            // interact with the analysis assistant, and return a response message.
            const chatAssistantQuery: ChatAssistantQuery  = {
                chat_id: selectedChatId,
                query: newMessageText,
            }
            const assistantResponse = await chatAssistantsService.sendMessage(chatAssistantQuery);

            // --- Placeholder for handling real assistant response ---
            // Assuming the backend will eventually return a response message
            // const assistantMessage: Message = {
            //     id: messages.length + 2,
            //     text: assistantResponse.text, // Adjust based on actual backend response structure
            //     sender: 'assistant',
            // };
            // setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            // --- End Placeholder ---

            // For now, since the backend returns empty string, add a mock assistant response
            const mockAssistantMessage: Message = {
                id: messages.length + 2,
                text: assistantResponse.data,
                sender: 'assistant',
            };
             setMessages((prevMessages) => [...prevMessages, mockAssistantMessage]);


        } catch (err) {
             setError(err instanceof Error ? err.message : 'Failed to send message');
             console.error('Failed to send message:', err);
             // Optionally, remove the optimistically added user message or mark it as failed
             setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== userMessage.id));
             // Or add a system message indicating failure
             setMessages((prevMessages) => [...prevMessages, { id: userMessage.id + 0.5, text: 'Failed to send.', sender: 'assistant' }]);
        } finally {
             setIsLoading(false);
        }
    };


  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)'}}> {/* Adjust height based on header/footer */}
      {/* Left Panel: Chat List */}
      <Box sx={{ width: isMobile ? '100%' : '300px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
          <Typography variant="h6" sx={{ ml: 1 }}>AI Assistants</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewChatDialog}
            size="small"
          >
            New Chat
          </Button>
        </Box>
        <Divider />
        {isLoading && !chatAssistants.length ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={20} /></Box>
        ) : error && !chatAssistants.length ? (
            <Alert severity="error">{error}</Alert>
        ) : (
            <List>
            {chatAssistants.map((chat) => (
                <ListItem
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                >
                <ListItemText
                    primary={chat.chat_name}
                    secondary={chat.chat_description || 'No description'}
                />
                </ListItem>
            ))}
            </List>
        )}
      </Box>

      {/* Right Panel: Chat Window */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {selectedChatId === null ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Select an AI Assistant to start chatting</Typography>
          </Box>
        ) : (
          <>
            {/* Chat Header (Optional: could show selected chat name) */}
            {/* <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                <Typography variant="h6">{chatAssistants.find(c => c.id === selectedChatId)?.chat_name}</Typography>
            </Box> */}

            {/* Message Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {/* Mock Messages Display */}
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            mb: 1,
                        }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1,
                                backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                                color: msg.sender === 'user' ? 'white' : 'black',
                                borderRadius: msg.sender === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0',
                                maxWidth: '70%',
                                wordBreak: 'break-word',
                            }}
                        >
                            {msg.text}
                        </Paper>
                    </Box>
                ))}
                {isLoading && ( // Indicate sending/receiving
                     <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                        <CircularProgress size={20} />
                     </Box>
                )}
                 {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            </Box>


            {/* Message Input Area */}
            <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                <InputBase
                    fullWidth
                    placeholder="Type your message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for newline
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    sx={{ mr: 1, p: 1, border: '1px solid #ccc', borderRadius: '4px' }}
                    disabled={isLoading}
                />
                <IconButton color="primary" onClick={handleSendMessage} disabled={isLoading}>
                    <SendIcon />
                </IconButton>
            </Box>
          </>
        )}
      </Box>

      {/* Create New Chat Dialog */}
      <Dialog open={newChatDialogOpen} onClose={handleCloseNewChatDialog}>
        <DialogTitle>Create New AI Assistant Chat</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Chat Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            disabled={isLoading}
            required
          />
           <TextField
            margin="dense"
            label="Description (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={newChatDescription}
            onChange={(e) => setNewChatDescription(e.target.value)}
            disabled={isLoading}
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="dense" disabled={isLoading}>
            <InputLabel id="analysis-assistant-select-label">Analysis Assistant</InputLabel>
            <Select
              labelId="analysis-assistant-select-label"
              value={selectedAnalysisAssistantId}
              label="Analysis Assistant"
              onChange={(e) => setSelectedAnalysisAssistantId(Number(e.target.value))}
              variant="outlined"
              required
            >
              <MenuItem value="">
                <em>Select an Assistant</em>
              </MenuItem>
              {analysisAssistants.map((assistant) => (
                <MenuItem key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewChatDialog} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleCreateNewChat} disabled={isLoading} variant="contained">
            {isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChatList;
