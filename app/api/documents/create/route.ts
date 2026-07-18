import DocumentModel from "@/models/DocumentModel";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async  function POST(req: Request){

    try {

        const body = await req.json();

        const {userId, title} = body;

        const document = await DocumentModel.createDocument({authorId: new ObjectId(userId), title});

        console.log("document in post ", document);

        return NextResponse.json({
            document,
        }, {
            status: 201
        })

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal Server Error"
        },{
            status: 500
        })
    }


}
