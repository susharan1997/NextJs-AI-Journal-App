'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { newEntry } from '@/utils/api';
import { useEffect, useState } from 'react';
import { userDataType } from '@/types';

const Container = styled.div`
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  width: 150px;
  margin: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  padding: 1.25rem;
  transition: background-color 0.3s ease;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  &: hover {
    background-color: #e9ecef;
  }
`;

const Title = styled.span`
  font-size: 1.2rem;
`;

const NewJournalEntryComponent = () => {

  const [parsedUserData, setParsedUserData] = useState<userDataType | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      setParsedUserData(parsedUser);
    }
  }, []);

  const handleOnClick = async () => {
    if (!parsedUserData) {
      console.log('User data not available');
      return;
    }

    try {
      const data = await newEntry(parsedUserData.id);
      if (data?._id) {
        router.push(`/journal/${data._id}`);
      } else {
        console.log(`Invalid data response: ${data}`);
        throw new Error('Invalid data response!');
      }
    } catch (error) {
      console.error(`Error creating new entry: ${error}`);
    }
  };

  return (
    <Container onClick={handleOnClick}>
      <Content>
        <Title>New Entry</Title>
      </Content>
    </Container>
  );
};

export default NewJournalEntryComponent;