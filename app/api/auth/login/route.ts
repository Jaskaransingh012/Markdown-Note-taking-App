import dbConnect from "@/lib/mongodb";
import { UserModel } from "@/schemas/UserSchema";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        const isPasswordValid = bcrypt.compare(password, user.);

    } catch (error) {

    }
}