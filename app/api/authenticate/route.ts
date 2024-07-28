import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email & password required!' }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password!' }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid Password!' }, { status: 400 });
        }
        const userData = {
            id: user.id,
            name: user.name,
        }
        return NextResponse.json({ message: 'Authentication Successful!', user: userData }, { status: 200 });
    }
    catch (error) {
        console.log('Authentication unsuccessful!');
        return NextResponse.json({ error: 'Internal server error' }, { status: 400 });
    }
}