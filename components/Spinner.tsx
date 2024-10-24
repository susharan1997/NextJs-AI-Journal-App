import styled from "styled-components";

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border: 2px solid #f7dc6f;
  border-top: 2px solid transparent;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
