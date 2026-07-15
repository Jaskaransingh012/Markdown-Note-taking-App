import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await User.login({
            email,
            password,
        });

        const userId = user._id.toString();
        const token = generateToken(userId);

        const response = NextResponse.json(
            {
                user,
                message: "Login Successfull",
            },
            {
                status: 201,
            },
        );

        response.cookies.set("accessToken", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
        
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error!",
            },
            {
                status: 400,
            },
        );
    }
}
