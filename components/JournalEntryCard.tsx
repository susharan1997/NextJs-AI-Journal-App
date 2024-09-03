'use client';
import styled from 'styled-components';
import { JournalEntryAnalysisType } from '@/types';

interface JournalEntryCardProps {
  entry: JournalEntryAnalysisType,
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 300px;
  min-height: 180px;
  margin: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
`;

const Section = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'color',
}) <{ color?: string }>`
  padding: 1.25rem;
  font-size: 12px;
  background-color: ${props => props.color};
  border-radius: 0.5rem 0.5rem 0 0;
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

const SummarySection = styled.div`
  display: flex;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  max-height: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 12px;
  text-align: center;
`;

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({entry}) => {
    const date = new Date(entry?.createdAt).toLocaleString();
    return (
        <Card>
            <Section color={entry?.analysis?.color ?? '-'}>{date}</Section>
            <Divider />
            <SummarySection>{entry?.analysis?.summary ?? '-'}</SummarySection>
            <Divider />
            <Section>{entry?.analysis?.mood ?? '-'}</Section>
        </Card>
    )
}

export default JournalEntryCard;