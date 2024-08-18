import _ from "lodash";
import React, { CSSProperties } from "react";
import styled, { ThemeProvider, css } from "styled-components";
import { Col } from "./Layout";
import { Box, Typography, useTheme } from "@mui/material";

export const LabeledTextArea: React.FC<{
  style?: CSSProperties;
  className?: string;
  label: string;
  value: string;
  warning?: string;
  warningColor?: string;
  disabled?: boolean;
  disabledReason?: string;
  secret?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  highlighted?: boolean;
}> = ({
  style,
  warning,
  warningColor,
  disabled = false, // Default value set to false
  disabledReason,
  label,
  value,
  onChange,
  className,
  secret,
  highlighted = false,
}) => {

  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <LabeledTextAreaContainer
        className={_.compact(["labeledTextAreaContainer", className]).join(" ")}
      >
        <Typography sx={{ color: theme.palette.secondary.main, fontWeight:'medium' }}>{label}</Typography>

        {warning && (
          <Box className="warning" minWidth='100px' maxWidth='150px' sx={{ color: "white", padding: '10px', borderRadius: '20px', backgroundColor: warningColor, textAlign: 'center' }}>
            {warning}
          </Box>
        )}

        <TextArea
          style={style}
          aria-label={label}
          title={disabled ? disabledReason : ""}
          disabled={disabled}
          value={value}
          onChange={onChange}
          highlighted={highlighted}
          theme={theme}
        />

        {secret && (
          <div className="secret">Hover to reveal public info sent to chain</div>
        )}
      </LabeledTextAreaContainer>
    </ThemeProvider>
  );
};

const LabeledTextAreaContainer = styled(Col)`
  height: 15vh;
  border-radius: 4px;
  position: relative;
  gap: 8px;
  & .warning {
    font-size: 80%;
  }
  .secret {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #171717;
    border: 1px dashed rgba(255, 255, 255, 0.5);
    color: rgba(255, 255, 255, 0.8);
    user-select: none;
    pointer-events: none;
    opacity: 0.95;
    justify-content: center;
    display: flex;
    align-items: center;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover .secret,
  & :focus + .secret {
    opacity: 0;
  }
`;

const TextArea = styled.textarea<{ highlighted: boolean }>`
  border: 0px solid #1C1C1C;
  background: #F3F2F2;
  border-radius: 10px;
  color: ${({ theme }) => theme.palette.secondary.main};
  height: 480px;
  padding: 16px;
  transition: all 0.2s ease-in-out;
  resize: none;
  outline: none;

  /* Apply different font sizes based on breakpoints */
  ${({ theme }) => css`
    font-size: 0.5rem; /* Default font size */

    ${theme.breakpoints.up('sm')} {
      font-size: 0.8rem; /* Font size for small screens and up */
    }

    ${theme.breakpoints.up('md')} {
      font-size: 0.9rem; /* Font size for medium screens and up */
    }

    ${theme.breakpoints.up('lg')} {
      font-size: 1rem; /* Font size for large screens and up */
    }
  `}

  ${({ highlighted, theme }) =>
    highlighted
      ? css`
          border: 2px solid ${theme.palette.accent.main};
          &:hover {
            border: 2px solid ${theme.palette.accent.main};
          }
          &:focus {
            border: 1px solid ${theme.palette.accent.main};
            box-shadow: 0 0 0 2px ${theme.palette.accent.main};
          }
        `
      : css`
          &:focus {
            border: 2px solid #1C1C1C;
          }
        `}
`;

export default LabeledTextArea;
