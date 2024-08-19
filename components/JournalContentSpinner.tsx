import styled from 'styled-components';

const JournalContentSpinner = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border: 2px solid green;
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

export default JournalContentSpinner;