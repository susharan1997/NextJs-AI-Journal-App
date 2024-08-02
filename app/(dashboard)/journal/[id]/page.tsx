'use client';
import JournalEntryModel from "@/models/JournalEntry";
import { NextPage } from 'next';
//import JournalEditor from "@/components/JournalEditor";
import { useEffect, useState } from "react";

const JournalPageComponent: NextPage<{ params: any }> = ({ params }) => {
    const [entry, setEntry] = useState<any>(null);
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
        console.log(params, 'JOURNAL ID -> journal/[id]');
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
                    const data = await response.json();
                    setEntry(data.entry);
                } catch (error) {
                    console.error('Error fetching journal entries:', error);
                }
            };
            fetchEntry();
        }
    }, [parsedUserData, params]);

    return (
        <div>
            {/* <JournalEditor journal={entry} /> */}
        </div>
    )
};

export default JournalPageComponent;
