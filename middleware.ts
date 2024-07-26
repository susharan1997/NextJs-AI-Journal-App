'use client';
import { NextRequest, NextResponse } from "next/server";

const isAuthenticated = (req: NextRequest) => {
    const userEmail = req.cookies.get('email')?.value;
    const userPassword = req.cookies.get('password')?.value;

    return !!userEmail && !!userPassword;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const publicPaths = ['/sign-in', '/sign-up', '/'];

    if(publicPaths.includes(pathname)){
        return NextResponse.next();
    }

    if(!isAuthenticated(req)){
        NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/:path*',
    ]
}