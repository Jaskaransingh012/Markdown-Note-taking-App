import { ObjectId } from "mongodb";


export interface DocumentSchema  {

  _id?: ObjectId;
  title: string;
  content?: string;
  authorId: ObjectId;
  markdown?: string;
  html ?: string;
  createdAt: Date;
  updatedAt: Date;

}



