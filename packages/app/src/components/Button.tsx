// import styled from "styled-components";

// export const Button = styled.button`
//   padding: 0 14px;
//   border-radius: 4px;
//   background: #8272e4;
//   border: none;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 600;
//   font-size: 0.9rem;
//   letter-spacing: -0.02em;
//   color: #fff;
//   cursor: pointer;
//   height: 48px;
//   width: 100%;
//   min-width: 32px;
//   transition: all 0.2s ease-in-out;
//   &:hover {
//     background: #9b8df2;
//   }
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// export const OutlinedButton = styled.button`
//   padding: 0 14px;
//   border-radius: 4px;
//   border: none;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 500;
//   font-size: 0.9rem;
//   letter-spacing: -0.02em;
//   color: #8272e4;
//   cursor: pointer;
//   height: 48px;
//   width: 100%;
//   min-width: 32px;
//   transition: all 0.2s ease-in-out;
//   background: transparent;
//   border: 1px solid #8272e4;
//   &:hover {
//     background: #9b8df2;
//     color: white;
//   }
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;


// export const TextButton = styled.button`
// width: fit-content;
// background: transparent;
// border: none;
// color: white;
// font-weight: 500;
// padding: 4px 16px;
// border-radius: 4px;
//   &:hover {
//     background: #00000020;
//     color: white;
//   }
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

import React from 'react';
import styled from "styled-components";
import { useTheme, Button as MuiButton } from "@mui/material";

interface ButtonProps {
  highlighted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  endIcon?: React.ReactNode;
  href?: string;
  target?: string;
}

const StyledButton = styled(MuiButton)<{ highlighted: boolean }>`
  text-transform: none;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: -0.02em;
  color: #fff;
  cursor: pointer;
  height: 48px;
  width: 100%;
  min-width: 32px;
  transition: all 0.2s ease-in-out;
  background: ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : '#1C1C1C')};

  &:hover {
    background: ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : '#1C1C1C')};
    opacity: 0.5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: ${({ highlighted, theme }) => (highlighted ? '#ffffff' : 'grey')};
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
    padding: 0 12px;
  }

  @media (max-width: 400px) {
    font-size: 0.6rem;
    padding: 0 4px;
    height: 40px;
  }
`;

const StyledOutlinedButton = styled(MuiButton)<{ highlighted: boolean }>`
  padding: 0 5px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: -0.02em;
  text-transform: none;
  cursor: pointer;
  height: 48px;
  width: 100%;
  min-width: 30px;
  transition: all 0.2s ease-in-out;
  background: '#ffffff';
  border: 1px solid ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : '#1C1C1C')};
  color: ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : '#1C1C1C')};

  &:hover {
    background: ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : '#1C1C1C')};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
    padding: 0 12px;
  }

  @media (max-width: 400px) {
    font-size: 0.6rem;
    padding: 0 2px;
    height: 40px;
  }
`;

const StyledTextButton = styled(MuiButton)<{ highlighted: boolean }>`
  width: fit-content;
  background: '#ffffff';
  border: none;
  color: ${({ highlighted, theme }) => (highlighted ? theme.palette.accent.main : theme.palette.secondary.main)};
  font-weight: 500;
  border-radius: 9px;

  &:hover {
    color: theme.palette.secondary.main;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
    padding: 2px 12px;
  }

  @media (max-width: 400px) {
    font-size: 0.6rem;
    padding: 0 2px;
    height: 40px;
  }
`;

export const Button: React.FC<ButtonProps> = ({ highlighted = false, disabled, onClick, children, endIcon, href, target }) => {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) return;
    if (href) {
      window.open(href, target);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton
      highlighted={highlighted}
      disabled={disabled}
      onClick={handleClick}
      theme={theme}
      endIcon={endIcon}
    >
      {children}
    </StyledButton>
  );
};

export const OutlinedButton: React.FC<ButtonProps> = ({ highlighted = false, disabled, onClick, children, endIcon, href, target }) => {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) return;
    if (href) {
      window.open(href, target);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledOutlinedButton
      highlighted={highlighted}
      disabled={disabled}
      onClick={handleClick}
      theme={theme}
      endIcon={endIcon}
    >
      {children}
    </StyledOutlinedButton>
  );
};

export const TextButton: React.FC<ButtonProps> = ({ highlighted = false, disabled, onClick, children, endIcon, href, target }) => {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) return;
    if (href) {
      window.open(href, target);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledTextButton
      highlighted={highlighted}
      disabled={disabled}
      onClick={handleClick}
      theme={theme}
      endIcon={endIcon}
    >
      {children}
      {endIcon && <span style={{ marginLeft: '8px' }}>{endIcon}</span>}
    </StyledTextButton>
  );
};

