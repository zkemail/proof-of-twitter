import styled from "styled-components";

export const TopBanner: React.FC<{ message: string }> = ({ message }) => {
  return <Container>{message}</Container>;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 16px;
  background: #68A3E9;
  color: #fff;
  font-weight: 500;
`;
