'use client';
import Banner from '@/components/Banner';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NewJournalEntryComponent from '@/components/NewJournalEntryComponent';
import JournalEntryCard from '@/components/JournalEntryCard';
import styled from 'styled-components';

const JournalsContainer = styled.div`
    height: 100%;
`;

const Title = styled.h2`
  font-size: 1.6em;
  padding: 10px;
  border-bottom: 2px solid black;
  text-align: center;
  text-align: start;
`;


function JournalComponent() {
    const [message, setMessage] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setUserData(parsedUser);
        }
    }, []);

    useEffect(() => {
        const fetchEntries = async () => {
            if (userData) {
                try {
                    const response = await fetch(`/api/journal-entries`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify(userData.id)
                    });
                    const data = await response.json();
                    setEntries(data.entries);
                } catch (error) {
                    console.error('Error fetching journal entries:', error);
                }
            }
        };

        fetchEntries();

        const hasShownBanner = localStorage.getItem('hasShownBanner');
        if (userData && !hasShownBanner) {
            const msg = `Welcome ${userData.name}`;
            setMessage(msg);
            setShowBanner(true);
            localStorage.setItem('hasShownBanner', 'true');
            setTimeout(() => setShowBanner(false), 3000);
        }
    }, [searchParams, userData]);

    return (
        <>
            <Banner message={message || ''} show={showBanner} />
            <JournalsContainer>
                <Title>
                    Journals
                </Title>
                <NewJournalEntryComponent />
                {Array.isArray(entries) && entries.map(journal => (
                    <JournalEntryCard key={journal._id} entry={journal} />
                ))}
            </JournalsContainer>
        </>
    );
};

export default JournalComponent;