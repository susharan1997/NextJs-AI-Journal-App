'use client';
import HistoryChart from '@/components/HistoryChart';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EntryAnalysisType } from "@/types";
import useUserStore from '@/store/useStore';

const ChartContainer = styled.div`
    width: 100%;
    height: calc(100dvh - 90px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    align-items: flex-start;
    font-family: 'Merriweather', Georgia, serif;
`;

const ScoreText = styled.span`
    font-weight: bold;
    font-size: 1em;
`;

const PageHeaderText = styled.span`
    font-weight: bold;
    font-size: 1.6em;
    text-decoration: underline;
`;

const NoteText = styled.span`
    font-size: 10px;
    color: red;
`

const HistoryPage: React.FC = () => {
    const [journalAnalysis, setJournalAnalysis] = useState<EntryAnalysisType[]>([]);
    const [average, setAverage] = useState<number>(0);
    const userData = useUserStore((state) => state.getUser());

    useEffect(() => {
        if (userData) {
            const fetchAnalysis = async () => {
                try {
                    const response = await fetch(`/api/analysis/`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify(userData.id),
                    });
                    const {journalAnalysis, average} = await response.json();
                    setJournalAnalysis(journalAnalysis);
                    setAverage(average);
                } catch (error) {
                    console.error('Error fetching analysis:', error);
                }
            };
            fetchAnalysis();
        }
    }, [userData]);

    return(
        <ChartContainer>
            <PageHeaderText>
                Graph Analysis
            </PageHeaderText>
            <ScoreText>
                {`Average Sentiment Score: ${average}`}
            </ScoreText>
            <NoteText>
                * Click on any dot in the line chart to go to that particular journal.
            </NoteText>
            <HistoryChart data={journalAnalysis} />
        </ChartContainer>
    )
}

export default HistoryPage;