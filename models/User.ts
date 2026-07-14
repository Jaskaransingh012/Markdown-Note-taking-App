import { ObjectId } from "mongodb";
import { SignUpUserSchema, LoginUserSchema, UserSchema } from "@/schemas/UserSchema"
import { db } from "@/services/database.service"
import bcrypt from 'bcrypt';


export default class User {
  private static collection = db.collection<UserSchema>("users");
  private static saltRounds = 10;

  static async signup(user: SignUpUserSchema) {
    // Check if user already exists
    const existingUser = await this.collection.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      user.password,
      this.saltRounds
    );

    const newUser: SignUpUserSchema = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    };

    const result = await this.collection.insertOne(newUser);

    return {
      _id: result.insertedId,
      ...newUser,
    };
  }

  static async login(user: LoginUserSchema) {
    // Find user by email
    const existingUser = await this.collection.findOne({
      email: user.email,
    });

    if (!existingUser) {
      throw new Error("Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Remove password before returning
    const { password, ...userWithoutPassword } = existingUser;

    return userWithoutPassword;
  }
}