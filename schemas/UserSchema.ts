
import {ObjectId} from "mongodb";

export interface SignUpUserSchema{
    name: string;
    email: string;
    password: string;
}

export interface LoginUserSchema{
    email: string;
    password: string;
}

export interface UserSchema{
    _id ?: ObjectId;
    name: string;
    email: string;
    password: string;
}