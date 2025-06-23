import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

type InputFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ value, onChange, onSend, onKeyPress, disabled }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', pb: 2 }}>
      <TextField
        fullWidth
        placeholder="Type your message..."
        variant="outlined"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        multiline
        maxRows={4}
        InputProps={{
          sx: {
            borderRadius: '25px',
            backgroundColor: 'white',
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSend} edge="end" color="primary" disabled={disabled || !value.trim()}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default InputField;
