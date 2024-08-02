'use client';

export const newEntry = async () => {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    const res = await fetch(new Request('/api/journal-entry'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: 'New content',
            userId: parsedUser.id,
        }),
    });

    if(res.ok){
        return res.json();
    }
    else {
        throw new Error('Something went wrong during API call!');
    }
}

// export const updateJournal = async (id: any, content: any) => {
//     const user = localStorage.getItem('user');
//     const parsedUser = user ? JSON.parse(user) : null;
//     const res = await fetch(new Request(`/api/journal-entry/${id}`), {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             content: content,
//             userId: parsedUser,
//         }),
//     });

//     if(res.ok){
//         return res.json();
//     }
//     else {
//         throw new Error('Something went wrong during the update API call!');
//     }
// }