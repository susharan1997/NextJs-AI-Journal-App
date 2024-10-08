'use client';
import styled from 'styled-components';

const BannerContainer = styled.div.withConfig({shouldForwardProp: (prop) => prop!== 'show'})<{ show: boolean }>`
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  width: 200px;
  padding: 20px;
  background-color: rgba(40, 44, 52, 0.8);
  color: white;
  position: fixed;
  margin: auto;
  top: 70px;
  left: 0;
  right: 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Message = styled.span`
  text-align: center;
`;

interface BannerProps {
  message: string;
  show: boolean;
}

const EditorBanner: React.FC<BannerProps> = ({ message, show }) => {
  return (
    <BannerContainer show={show}>
      <Message>{message}</Message>
    </BannerContainer>)
};

export default EditorBanner;