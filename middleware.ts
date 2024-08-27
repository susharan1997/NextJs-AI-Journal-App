import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { revalidatePath } from "next/cache";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const isAuthenticated = async (req: NextRequest) => {
    const token = req.cookies.get('auth-token')?.value;

    if(!token)
    {
        console.log('No token found!');
        return false;
    }

    try{
        const decodeToken = await jwtVerify(token, SECRET_KEY);
        console.log('User is Authenticated', decodeToken);
        return true;
    }catch(error){
        console.log('JWT verification failed', error);
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const publicPaths = ['/sign-in', '/sign-up', '/'];

    if (publicPaths.includes(pathname)) {
        console.log('Accessing public paths, proceeding without token authentication.')
        return NextResponse.next();
    }

    const authenticated = await isAuthenticated(req);

    if(!authenticated){
        console.log("User is not authenticated, redirecting to sign-in.");
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    console.log("User is authenticated, proceeding to the protected route.");
    return NextResponse.next();
}

export const config = {
    matcher: ['/journal/:path*', '/history', '/journal'],
}