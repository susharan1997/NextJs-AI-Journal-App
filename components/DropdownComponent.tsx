import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Banner from "./Banner";

const DropdownContainer = styled.div`
  display: inline-block;
  position: relative;
`;

const DropdownButton = styled.div`
  cursor: pointer;
`;

const DropdownContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 1;
  top: 120%;
  right: 0;
  border-radius: 5px;
`;

const DropdownItem = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
    border-radius: 5px;
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
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch(new Request("/api/sign-out"), {
        method: "POST",
      });

      if (res.ok) {
        setMessage("Logout successful!");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
        router.push("/");
      } else {
        throw new Error(`Response not OK: ${res.status}`);
      }
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <DropdownContainer>
      <Banner message={message || ""} show={showBanner} />
      <DropdownButton onClick={handleToggle}>
        <UserProfileIcon>
          <svg viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </UserProfileIcon>
      </DropdownButton>
      <DropdownContent isOpen={isOpen} aria-hidden={!isOpen}>
        <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
      </DropdownContent>
    </DropdownContainer>
  );
};

export default DropdownComponent;
