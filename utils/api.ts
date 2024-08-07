'use client';

import { useEffect } from "react";

export async function newEntry(userId: any) {
    if (userId) {
        const res = await fetch('/api/journal-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: 'New content',
                userId: userId,
            }),
        });
        const { data } = await res.json();
        if (res.ok) {
            return data;
        }
        else {
            console.log('Error during new journal entry API call!');
        }
    }
    else {
        return null;
    }
}

export const updateJournal = async (id: string, { content }: any) => {

    if(!id){
        console.log(`Invalid journal id: ${id}`);
        return null;
    }

    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;

    try {
        const res = await fetch(new Request(`/api/journal-entry/${id}`), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                userId: parsedUser?.id,
            }),
        });
        if (!res.ok) {
            throw new Error(`Response not OK: ${res.status}`);
        }

        const result = await res.json();
        return result || {};
    }
    catch (error) {
        console.error('Error during updateJournal call:', error);
        return {};
    }
}