import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){

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

    return NextResponse.json({
        payload,
    })

}
