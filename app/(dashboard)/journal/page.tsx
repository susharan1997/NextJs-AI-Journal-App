'use client';
import Banner from '@/components/Banner';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NewJournalEntryComponent from '@/components/NewJournalEntryComponent';
import JournalEntryCard from '@/components/JournalEntryCard';
import styled from 'styled-components';
import Link from 'next/link';

const JournalsContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
    max-height: 75%;
    border: 1px solid grey;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.9);
    border-radius: 0.5rem;
    margin-left: 10px;
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
    console.log(entries.map(entry => typeof entry?.analysis?._id), 'JOURNAL ENTRIES -> /journal page');

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
    }, [userData]);

    return (
        <>
            <Banner message={message || ''} show={showBanner} />
            <Title>
                Journals
            </Title>
            <NewJournalEntryComponent />
            <JournalsContainer>
                {Array.isArray(entries) && entries.map((journal, index) => (
                    <Link href={`/journal/${journal?.analysis?._id}`} key={index}>
                        <JournalEntryCard key={journal?.analysis?._id} entry={journal} />
                    </Link>
                ))}
            </JournalsContainer>
        </>
    );
};

export default JournalComponent;