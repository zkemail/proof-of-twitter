import styled from "styled-components";

export const Button = styled.button`
  padding: 0 14px;
  border-radius: 4px;
  background: #8272e4;
  border: none;
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
  &:hover {
    background: #9b8df2;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const OutlinedButton = styled.button`
  padding: 0 14px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: -0.02em;
  color: #8272e4;
  cursor: pointer;
  height: 48px;
  width: 100%;
  min-width: 32px;
  transition: all 0.2s ease-in-out;
  background: transparent;
  border: 1px solid #8272e4;
  &:hover {
    background: #9b8df2;
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


export const TextButton = styled.button`
width: fit-content;
background: transparent;
border: none;
color: white;
font-weight: 500;
padding: 4px 16px;
border-radius: 4px;
  &:hover {
    background: #00000020;
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
