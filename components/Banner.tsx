"use client";
import styled from "styled-components";

const BannerContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "show",
})<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 600px;
  height: 80px;
  padding: 20px;
  background-color: rgba(40, 167, 69, 0.9);
  color: white;
  font-size: 1.2em;
  position: fixed;
  margin: auto;
  top: 50px;
  left: 0;
  right: 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Message = styled.span`
  flex-grow: 1;
  text-align: center;
`;

interface BannerProps {
  message: string;
  show: boolean;
}

const Banner: React.FC<BannerProps> = ({ message, show }) => {
  return (
    <BannerContainer show={show}>
      <Message>{message}</Message>
    </BannerContainer>
  );
};

export default Banner;
