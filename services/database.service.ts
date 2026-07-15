import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";


// Export golbal variable 



// Initialization
export async function connectDB()
{
    dotenv.config();
    console.log(process.env.DB_NAME);
    const {DB_CONN_STRING, DB_NAME} = process.env;
    if(!DB_CONN_STRING || !DB_NAME) {
        throw new Error("Mongo URI OR DB_NAME is not Provided!");
    }
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);

    await client.connect();

    const db : mongoDB.Db = client.db(DB_NAME);
    return db;
}

export const db = await connectDB();