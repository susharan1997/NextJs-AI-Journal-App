'use client';
import JournalEditor from '@/components/JournalEditor';
import { NextPage } from 'next';
import { useEffect, useState } from "react";

const JournalPageComponent: NextPage<{ params: any }> = ({ params }) => {
    const [entryAnalysis, setEntryAnalysis] = useState<any>(null);
    const [parsedUserData, setParsedUserData] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setParsedUserData(parsedUser);
        }
    }, []);

    useEffect(() => {
        const journalId = params?.id;
        if (parsedUserData && journalId) {
            const fetchEntry = async () => {
                try {
                    const response = await fetch(`/api/journal-entry/${journalId}`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify(parsedUserData.id),
                    });
                    const {entryAnalysis} = await response.json();
                    setEntryAnalysis(entryAnalysis);
                } catch (error) {
                    console.error('Error fetching journal entries:', error);
                }
            };
            fetchEntry();
        }
    }, [parsedUserData, params]);

    return (
        <div>
            <JournalEditor journal={entryAnalysis} />
        </div>
    )
};

export default JournalPageComponent;
