'use client';
import HistoryChart from '@/components/HistoryChart';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { userDataType } from '../../../types';
import { EntryAnalysisType } from '../../../models/EntryAnalysis';

const ChartContainer = styled.div`
    width: 100%;
`;

const ScoreText = styled.span`
    font-weight: bold;
`;

const HistoryPage: React.FC = () => {
    const [parsedUserData, setParsedUserData] = useState<userDataType | null>(null);
    const [journalAnalysis, setJournalAnalysis] = useState<EntryAnalysisType[]>([]);
    const [average, setAverage] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setParsedUserData(parsedUser);
        }
    }, []);

    useEffect(() => {
        if (parsedUserData) {
            const fetchAnalysis = async () => {
                try {
                    const response = await fetch(`/api/analysis/`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify(parsedUserData.id),
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
    }, [parsedUserData]);

    return(
        <ChartContainer>
            <ScoreText>
                {`Average Sentiment Score: ${average}`}
            </ScoreText>
            <HistoryChart data={journalAnalysis} />
        </ChartContainer>
    )
}

export default HistoryPage;