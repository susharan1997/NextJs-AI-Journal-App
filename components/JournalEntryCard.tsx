'use client';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
`;

const Section = styled.div`
  padding: 1.25rem;
  &:first-child {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }
  &:last-child {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const JournalEntryCard = ({entry}: any) => {
    const date = new Date(entry?.createdAt).toLocaleString();
    return (
        <Card>
            <Section>{date}</Section>
            <Divider />
            <Section>{entry?.analysis?.summary}</Section>
            <Divider />
            <Section>{entry?.analysis?.mood}</Section>
        </Card>
    )
}

export default JournalEntryCard;