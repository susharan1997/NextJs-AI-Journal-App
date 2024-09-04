'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  font-family: 'Merriweather', Georgia, serif;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  font-size: 2.2em;
  margin: 0;
  color: #f1f1f1;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 10px;
  background-color: #282c34;
  color: #ddd;
  text-align: center;
  font-size: 0.9em;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
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
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
`;

const Text = styled.p`
  align-text: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  width: 500px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 1em;
  font-weight: bold;
  color: #282c34;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1.2em;
  color: white;
  background-color: #8b0000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #5a0000;
    transform: scale(1.05);
  }
`;

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/sign-up');
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
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
      </LandingPageContainer></>
  );
};

export default LandingPage;