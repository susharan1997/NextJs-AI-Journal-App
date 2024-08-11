import { NextRequest, NextResponse } from "next/server";

const isAuthenticated = (req: NextRequest) => {
    const userEmail = req.cookies.get('email')?.value;
    const userPassword = req.cookies.get('password')?.value;
    console.log(userEmail, userPassword, 'USER DETAILS');

    return !!userEmail && !!userPassword;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const publicPaths = ['/sign-in', '/sign-up', '/'];

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if(!isAuthenticated(req)){
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!sign-in|sign-up|_next/static|_next/image|favicon.ico).*)', // Exclude static and public paths
    ],
}