'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import DropdownComponent from '../components/DropdownComponent';

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
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
font-size: 1.5em;
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
`;

const Text = styled.p`
margin-bottom: 20px;
font-size: 1.2em;
`;

const Button = styled.button`
padding: 10px 20px;
font-size: 1em;
color: white;
background-color: #007bff;
border: none;
border-radius: 5px;
cursor: pointer

  &:hover {
  background-color: #0056b3;
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
        <DropdownComponent />
      </Header>
      <Body>
        <BodyTitle>Welcome to the MindScribe App!</BodyTitle>
        <Text>
          This is a tool that analyses users' emotions based on their journal entries and logs the data to plot graphs related to the same.
        </Text>
        <Button onClick={handleStart}>Let's get started!</Button>
      </Body>
      <Footer>© 2024 MindScribe App. All rights reserved.</Footer>
    </LandingPageContainer>
  );
};

export default LandingPage;

//mongodb remote cluster account old connection string
//MONGODB_URI=mongodb+srv://<susharanhonnal>:<ITqzhjshV0ldbQi1>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority