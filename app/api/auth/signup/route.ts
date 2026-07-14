import User from "@/models/User"
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    try{

    const body = await req.json();
    const { email, name, password } = body;

    const user = await User.signup({
        name,
        email,
        password
    })

    return NextResponse.json({
        message: "User Created Successfully",
        user,
    },{
        status: 201
    })
}
catch(error){
    return NextResponse.json({
        error: error instanceof Error ? error.message : "Internal Server Error!"
    },{
        status : 400
    })
}

}