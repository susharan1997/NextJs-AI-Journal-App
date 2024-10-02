'use client';
import { userDataType } from "@/types";

interface contentType {
    content: string
}

export async function newEntry(userId: string) {
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

export const updateJournal = async (id: string, { content }: contentType, userData: userDataType) => {

    if(!id){
        console.log(`Invalid journal id: ${id}`);
        return null;
    }

    try {
        const res = await fetch(new Request(`/api/journal-entry/${id}`), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                userId: userData?.id,
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

export const deleteJournal = async (id: string, userData: userDataType) => {
    if(!id){
        console.log(`Invalid journal Id: ${id}`);
        return null;
    }

    try{
        const res = await fetch(new Request(`/api/journal-entry/${id}`), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData?.id,
            })
        });

        if(!res.ok){
            throw new Error(`Response not OK: ${res.status}`);
        }
        return res.json();
    }
    catch(error){
        console.error(`Error while deleting Journal entry: ${error}`);
        return {};
    }

}

let ongoingRequest: any = null;

export const askQuestion = async (question: string, userData: userDataType) => {
    if(!question){
        console.error('Invalid question:', question);
        return null;
    }
    if(!userData?.id){
        console.error('Invalid user data:', userData);
        return null;
    }

    if(ongoingRequest) 
        return ongoingRequest;

    try{
        ongoingRequest = await fetch(new Request('/api/question'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                question,
                userId: userData?.id, 
            })
        });

        const res = await ongoingRequest;

        if(!res.ok){
            throw new Error(`Response not OK: ${res.status}`);
        }

        const data = ongoingRequest.json();
        ongoingRequest = null;
        return data;
    }
    catch(error){
        console.error('Error while computing question:', error);
        ongoingRequest = null;
        return {};
    }
}