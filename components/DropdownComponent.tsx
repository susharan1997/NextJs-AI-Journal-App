import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const DropdownContainer = styled.div`
  position: absolute;
  display: inline-block;
  right: 10px;
  top: 10px;
`;

const DropdownButton = styled.div`
  cursor: pointer;
`;

const DropdownContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
}) <{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  min-width: 160px;
  z-index: 1;
  right: 0;
`;

const DropdownItem = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #ddd;
  }
`;

const UserProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    fill: #282c34;
  }
`;

const DropdownComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSignUp = () => {
    router.push('/');
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={handleToggle}>
        <UserProfileIcon>
          <svg viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </UserProfileIcon>
      </DropdownButton>
      <DropdownContent isOpen={isOpen} aria-hidden={!isOpen}>
        <DropdownItem onClick={handleSignUp}>Sign out</DropdownItem>
      </DropdownContent>
    </DropdownContainer>
  );
};

export default DropdownComponent;