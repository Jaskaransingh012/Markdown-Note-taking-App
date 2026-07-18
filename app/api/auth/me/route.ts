import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){

    try{



    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;


    if(!token){
        return NextResponse.json({
            message: "Unauthorized",
        },
    {
        status: 401,
    })
    }

    const payload = verifyToken(token);

    const user = await User.me(payload.userId);

    return NextResponse.json({
        user,
    })
}catch(error){
    return NextResponse.json({
        error: error instanceof Error ? error.message : "Internal Server Error",
    }, {
        status : 401
    })
}

}
