import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Cookies } from "./types";
import { redisClient } from "@/redis/redis";
import { sessionSchema } from "./zod-schema";
const COOKIE_SESSION_KEY = "session-id";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserFromSession = async (cookie: Pick<Cookies, "get">) => {
  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;
  console.log("SessionId", sessionId);

  if (!sessionId) return null;

  return getUserById(sessionId);
};

export const getUserById = async (sessionId: string) => {
  const redisUser = await redisClient.get(`session:${sessionId}`);
  console.log("redisUser", redisUser);

  const { success, data: user } = sessionSchema.safeParse(redisUser);

  return success ? user : null;
};
