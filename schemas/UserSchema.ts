import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

// 1. Define the schema structure using Mongoose configuration
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  roles: { type: [String], default: ['user'] }
});

// 2. Automatically derive the "plain" TypeScript data type
export type User = InferSchemaType<typeof userSchema>;
// Derived Type: { name: string; email: string; roles: string[]; age?: number; }

// 3. Optional: Derive the fully "hydrated" document type (includes _id, save(), etc.)
export type UserDocument = HydratedDocument<User>;

// 4. Create and export the model
export const UserModel = model<User>('User', userSchema);


