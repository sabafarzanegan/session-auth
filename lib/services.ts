import crypto from "crypto";
import { Cookies, userSession } from "./types";
import { redisClient } from "@/redis/redis";
import { sessionSchema } from "./zod-schema";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";
export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex").normalize();
};

export const hashPasswordHandle = (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error);
      resolve(hash.toString("hex").normalize());
    });
  });
};

export const createUserSession = async (
  user: userSession,
  cookies: Pick<Cookies, "set">
) => {
  // in the  first we create sessionId
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  //   store sessionId to redis
  await redisClient.set(`session:${sessionId}`, sessionSchema.safeParse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  //   set sessionId to cookies
  setCookie(sessionId, cookies);
};

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
