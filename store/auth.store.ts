import authApi from "@/lib/axios";
import User from "@/models/User";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;

    logout: () => Promise<void>;

    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    login: async (email, password) => {
        set({ loading: true });

        const { data } = await authApi.post("/login", {
            email,
            password,
        });

        set({
            user: data.user,
            isAuthenticated: true,
            loading: false,
        });
    },

    logout: async () => {
        await authApi.post("/logout");

        set({
            user: null,
            isAuthenticated: false,
        });
    },

    fetchUser: async () => {
        try {
            const { data } = await authApi.get("/me");

            set({
                user: data.user,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
            });
        }
    },
}));
