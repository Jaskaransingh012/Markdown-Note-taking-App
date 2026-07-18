import { DocumentSchema } from "@/schemas/DocumentSchema";
import { db } from "@/services/database.service";
import { marked } from "marked";
import { ObjectId } from "mongodb";

export default class DocumentModel {
    private static collection = db.collection<DocumentSchema>("documents");

    static async createDocument(document: Omit<DocumentSchema, "_id" | "createdAt" | "updatedAt">) {
        const newDocument = {
            ...document,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await this.collection.insertOne(newDocument);
        return {
            _id: result.insertedId,
            ...newDocument,
        };
    }

    static async getDocumentById(id: string, userId: string) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid document id");
        }

        const document = await this.collection.findOne({
            _id: new ObjectId(id),
            authorId: new ObjectId(userId),
        });

        if (!document) {
            throw new Error("Document not found or you are not authorized");
        }

        return document;
    }

    static async convertDocument(id: string, markdown: string, userId: string) {
        const html = await marked.parse(markdown);

        const result = await this.collection.findOneAndUpdate(
            {
                _id: new ObjectId(id),
                authorId: new ObjectId(userId),
            },
            {
                $set: {
                    markdown,
                    html,
                    updatedAt: new Date(),
                },
            },
            {
                returnDocument: "after",
            },
        );

        if (!result) {
            throw new Error("Document not found or you are not authorized");
        }

        return result;
    }

    static async getDocuments(userId: string){

        console.log("This function");

        const result = await this.collection.find({
            authorId: new ObjectId(userId),
        }).toArray();

        console.log(result);


        return result;
    }
}
