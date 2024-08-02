'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { newEntry } from '@/utils/api';
import { useEffect } from 'react';

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
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const Title = styled.span`
  font-size: 1.2rem;
`;

const NewJournalEntryComponent = () => {
    const router = useRouter();

    const handleOnClick = async () => {
        const {data} = await newEntry();
        if(data){
          router.push(`/journal/${data.id}`);
        }
        else{
          console.log(`Invalid data response: ${data}`);
          throw new Error('Invalid data response!');
        }
    }

    return (
      <Container onClick={handleOnClick}>
        <Content>
          <Title>New Entry</Title>
        </Content>
      </Container>
    );
  };
  
  export default NewJournalEntryComponent;