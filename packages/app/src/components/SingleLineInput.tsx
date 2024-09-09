import React from 'react';
import styled from "styled-components";
import { useTheme, TextField, Box, Typography } from "@mui/material";

interface SingleLineInputProps {
  label: string;
  value: any;
  onChange: (e: any) => void;
  highlighted?: boolean;
  disabled?: boolean; // Optional disabled prop
}

export const SingleLineInput: React.FC<SingleLineInputProps> = ({
  label,
  onChange,
  value,
  highlighted = false,
  disabled = false, // Default value set to false
}) => {
  
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography 
        sx={{
          color: theme.palette.secondary.main,
          fontWeight: 'medium',
        }}
      >
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={onChange}
        placeholder={label}
        variant="outlined"
        fullWidth
        disabled={disabled} // Apply the disabled prop to the TextField
        InputProps={{
          style: {
            color: theme.palette.secondary.main,
            background: "#F3F2F2",
            borderRadius: "10px",
            border: 'none',
            outline: 'none',
            pointerEvents: disabled ? 'none' : 'auto', // Ensure it's non-clickable
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: highlighted ? theme.palette.accent.main : "#1C1C1C",
              borderWidth: highlighted ? '2px' : '1px',
              borderStyle: highlighted ? 'solid' : "none",
            },
            "&:hover fieldset": {
              borderColor: highlighted ? theme.palette.accent.main : "#1C1C1C",
              borderWidth: '2px',
              borderStyle: highlighted ? 'solid' : "none",
            },
            "&.Mui-focused fieldset": {
              borderColor: highlighted ? theme.palette.accent.main : "#1C1C1C",
              borderWidth: '2px',
              borderStyle: 'solid'
            },
            transition: "all 0.2s ease-in-out",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: 'none',
          },
        }}
      />
    </Box>
  );
};
