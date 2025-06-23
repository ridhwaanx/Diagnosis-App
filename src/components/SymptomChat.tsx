"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import InputField from '@/components/InputField';
import CloseIcon from '@mui/icons-material/Close';

// Type definitions
type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type DiagnosisPrediction = {
  disease: string;
  confidence: number;
  info: string;
};

interface SymptomChatProps {
  selectedSymptom: string; // Pre-selected symptom from parent component
}

const SymptomChat = ({ selectedSymptom }: SymptomChatProps) => {

  // State management
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get user ID from localStorage
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm here to help assess your symptoms. Please describe how you're feeling in detail.",
      sender: 'bot',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<DiagnosisPrediction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

  // Pre-fill input with selected symptom
  useEffect(() => {
    if (selectedSymptom) {
      setInput(prev => prev ? `${prev}, ${selectedSymptom}` : selectedSymptom);
    }
  }, [selectedSymptom]);

  // Reset chat to initial state
  const handleClearMessages = () => {
    setMessages([
      {
        text: "Hello! I'm here to help assess your symptoms. Please describe how you're feeling in detail.",
        sender: 'bot',
      }
    ]);
    setPredictions([]);
  };

  // Handle sending user message and getting bot response
  const handleSendMessage = async () => {
    if (!input.trim()) {
      setMessages(prev => [...prev, {
        text: "Please describe your symptoms before submitting.",
        sender: 'bot'
      }]);
      return;
    }
  
    if (input.trim().length < 10) {
      setMessages(prev => [...prev, {
        text: "Please provide more detailed symptoms (at least 10 characters). The more details you provide, the better I can help!",
        sender: 'bot'
      }]);
      return;
    }
  
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    // Call prediction API
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ symptoms: input, top_n: 3, user_id: userId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to get prediction');
      }
  
      const result = await response.json();
      setPredictions(result);
  
      // Add bot response with top prediction
      const botMessage = {
        text: `Based on your symptoms, the most likely condition is ${result[0].disease} (${(result[0].confidence * 100).toFixed(1)}% confidence).`,
        sender: 'bot' as const,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: error instanceof Error ? error.message : "Sorry, I encountered an error processing your symptoms. Please try again.",
        sender: 'bot' as const,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press for message submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Render diagnosis details in tooltip
  const renderDiagnosisTooltip = () => {
    if (predictions.length === 0) return null;

    return (
      <Box sx={{ p: 1, color: 'white' }}>
        <Typography variant="body2" gutterBottom>
          <strong>Top Predictions:</strong>
        </Typography>
        <List dense>
          {predictions.map((prediction, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={`${prediction.disease} (${(prediction.confidence * 100).toFixed(1)}%) \n`}
                secondary={prediction.info}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (          
    <Card sx={{ 
      maxWidth: '100%', 
      height: '58vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'transparent', 
      boxShadow: 'none',
      position: 'relative' // Added for positioning the clear button
    }}>

      <CardContent sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        pr: 1, 
        pl: 0,
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'transparent' },
        '&:hover::-webkit-scrollbar-thumb': { 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: '8px' 
        },
      }}>
        <List>
          {messages.map((message, index) => {
            const isBot = message.sender === 'bot';
            const isLastBot = isBot && index === messages.length - 1 && predictions.length > 0;

            const messageBox = (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isBot ? 'grey.100' : 'primary.main',
                  color: isBot ? 'text.primary' : 'primary.contrastText',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Box>
            );

            return (
              <ListItem
                key={index}
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  py: 1
                }}
              >
                {isLastBot ? (
                  <Tooltip 
                    title={renderDiagnosisTooltip()} 
                    placement="bottom-start" 
                    arrow 
                  >
                    {messageBox}
                  </Tooltip>
                ) : messageBox}
              </ListItem>
            );
          })}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start', py: 2 }}>
              <CircularProgress size={20} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </CardContent>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1,
      }}>
        {/* Clear messages button */}
        <IconButton 
          aria-label="clear messages"
          onClick={handleClearMessages}
          sx={{
            position: 'absolute',
            bottom: 35,
            left: 120,
            zIndex: 1,
            color: 'white',
            '&:hover': {
              color: 'grey',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseIcon fontSize="" />
        </IconButton>
        <InputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          placeholder="Describe your symptoms..."
        />
      </Box>
    </Card>
  );
};

export default SymptomChat;