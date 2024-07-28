'use client';
import Banner from '@/components/Banner';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const JournalComponent = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [userDecryptedData, setUserDecryptedData] = useState<any>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const userData = searchParams.get('userData');
        const decrypterUserData = userData ? JSON.parse(decodeURIComponent(userData)) : null;
        const hasShownBanner = localStorage.getItem('hasShownBanner');

        if (decrypterUserData && !hasShownBanner) {
            setUserDecryptedData(decrypterUserData);
            const msg = `Welcome ${decrypterUserData.name}`;
            setMessage(msg);
            setShowBanner(true);
            localStorage.setItem('hasShownBanner', 'true');
            setTimeout(() => setShowBanner(false), 3000);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchEntries = async () => {
            if (userDecryptedData) {
                try {
                    const response = await fetch(`/api/journal-entries?userId=${userDecryptedData.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setEntries(data);
                    }
                }
                catch (error) {
                    console.log('An error occurred while fetching the Journal entries:', error);
                }
            }
        }

        fetchEntries();
    }, [userDecryptedData]);

    return (
        <>
            <Banner message={message || ''} show={showBanner} />
            <div>
                Journal
            </div>
        </>
    );
};

export default JournalComponent;