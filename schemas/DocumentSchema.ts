import mongoose from "mongoose";
import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

// 1. Define the schema structure using Mongoose configuration
const documentSchema = new Schema({
     title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Document",
    },

    markdown: {
      type: String,
      required: true,
      default: "",
    },

    html: {
      type: String,
      required: true,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
});

// 2. Automatically derive the "plain" TypeScript data type
export type Document = InferSchemaType<typeof documentSchema>;
// Derived Type: { name: string; email: string; roles: string[]; age?: number; }

// 3. Optional: Derive the fully "hydrated" document type (includes _id, save(), etc.)
export type DocumentSchema = HydratedDocument<Document>;

// 4. Create and export the model
export const UserModel = model<Document>('Document', documentSchema);


