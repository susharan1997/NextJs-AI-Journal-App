'use client';
import Banner from '@/components/Banner';
import { useEffect, useState } from 'react';
import NewJournalEntryComponent from '@/components/NewJournalEntryComponent';
import JournalEntryCard from '@/components/JournalEntryCard';
import styled from 'styled-components';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Question from '../../../components/Question';
import { useRouter } from 'next/navigation';
import JournalContentSpinner from '../../../components/JournalContentSpinner';
import { userDataType, JournalEntryAnalysisType } from '@/types';

const JournalsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 5px;
    overflow-y: auto;
    width: 95%;
    max-height: 75%;
    border: 1px solid grey;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.9);
    border-radius: 0.5rem;
    background-color: #282c34;
`;

const Title = styled.h2`
  font-size: 1.6em;
  padding: 10px;
  border-bottom: 2px solid black;
  text-align: center;
  text-align: start;
`;

const StyledJournalContentSpinner = styled(JournalContentSpinner)`
    position: absolute;
    top: 50%;
    left: 55%;
`;


function JournalComponent() {
    const [message, setMessage] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [entries, setEntries] = useState<JournalEntryAnalysisType[] | null>([]);
    const [userData, setUserData] = useState<userDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const deletedId = searchParams.get('deleted');
        if(deletedId){
            setMessage(`Deleted the journal (${deletedId} successfully!)`);
            setShowBanner(true);
            const url = new URL(window.location.href);
            url.searchParams.delete('deleted');
            router.replace(url.toString(), undefined);
            setTimeout(() => setShowBanner(false), 3000);
        }
    }, [searchParams, router]);

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
                finally{
                    setLoading(false);
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
    }, [userData, setEntries]);

    if(loading){
        return(
            <StyledJournalContentSpinner>
                <JournalContentSpinner/>
            </StyledJournalContentSpinner>
        )
    }

    return (
        <>
            <Banner message={message || ''} show={showBanner} />
            <Title>
                Journals
            </Title>
            <Question/>
            <NewJournalEntryComponent />
            <JournalsContainer>
                {Array.isArray(entries) && entries.map((journal: JournalEntryAnalysisType, index: number) => (
                    <Link href={`/journal/${journal?._id}`} key={index}>
                        <JournalEntryCard key={journal?._id} entry={journal} />
                    </Link>
                ))}
            </JournalsContainer>
        </>
    );
};

export default JournalComponent;