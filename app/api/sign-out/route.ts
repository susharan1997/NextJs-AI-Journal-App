import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const response = NextResponse.json({message: 'Logged out successfully!'}, {status: 200});

    response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });

    return response;
}