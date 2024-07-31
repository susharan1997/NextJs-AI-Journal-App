'use client';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { newEntry } from '@/utils/api';

const Container = styled.div`
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const Content = styled.div`
  padding: 1.25rem;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const Title = styled.span`
  font-size: 1.875rem;
`;

const NewJournalEntryComponent = () => {
    const router = useRouter();

    const handleOnClick = async () => {
        const {data} = await newEntry();
        router.push(`/journal/${data.id}`);
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