'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  font-family: Arial, sans-serif;
  background-image: url('/images/journal-bg-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  `;

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background-color: #282c34;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  margin: 0;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 10px;
  background-color: #282c34;
  color: white;
  text-align: center;
`;

const Body = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
`;

const BodyTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: bold;
  color: #282c34;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
  border-radius: 0.5em;
`;

const Text = styled.p`
  align-text: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  width: 500px;
  border: 10px solid #61bbf2;
  border-radius: 1em;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &: hover {
  background-color: #013a78;
}
`;

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/sign-up');
  };

  return (
    <LandingPageContainer>
      <Header>
        <Title>MindScribe</Title>
      </Header>
      <Body>
        <BodyTitle>Welcome to the Journal App!</BodyTitle>
        <Text>
          This is a tool that analyses users&apos; emotions based on their journal entries and logs the data to plot graphs related to the same.
        </Text>
        <Button onClick={handleStart}>Let&apos;s get started!</Button>
      </Body>
      <Footer>© 2024 MindScribe App. All rights reserved.</Footer>
    </LandingPageContainer>
  );
};

export default LandingPage;