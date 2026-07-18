"use client";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
    const { fetchUser, user } = useAuthStore();

    useEffect(() => {
        fetchUser();
        console.log("user ", user);
    }, []);

    useEffect(() => {
        console.log("User: in other useEffect", user);
    }, [user]);

    return <>Hello</>;
}
