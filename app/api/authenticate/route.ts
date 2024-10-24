import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required!" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password!" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid Password!" }, { status: 400 });
    }

    const token = await new SignJWT({ id: user.id, name: user.name })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(SECRET_KEY);

    const userData = {
      id: user.id,
      name: user.name,
    };
    const response = NextResponse.json(
      { message: "Authentication Successful!", user: userData },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });

    return response;
  } catch (error) {
    console.log("Authentication unsuccessful!", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 }
    );
  }
}
