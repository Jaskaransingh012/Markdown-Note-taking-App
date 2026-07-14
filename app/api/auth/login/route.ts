import User from "@/models/User"
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = User.login({
            email,
            password
        })

        return NextResponse.json({
            message: "Login Successfull"
        }, {
            status: 201
        })


    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal Server Error!"
        }, {
            status: 400
        })
    }
}