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

// add sessionId to cookie
function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

export const getUserFromSession = async (cookie: Pick<Cookies, "get">) => {
  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;
  console.log("SessionId", sessionId);

  if (!sessionId) return null;

  return await getUserById(sessionId);
};
// get user from redis by sessionId
export const getUserById = async (sessionId: string) => {
  const redisUser = await redisClient.get(`session:${sessionId}`);
  console.log("redisUser", redisUser);

  const { success, data: user } = sessionSchema.safeParse(redisUser);

  return success ? user : null;
};

export const removeUserFromSession = async (
  cookie: Pick<Cookies, "delete" | "get">
) => {
  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;
  await redisClient.del(`session:${sessionId}`);
  cookie.delete(COOKIE_SESSION_KEY);
};

export const comparePassword = async ({
  hashedPassword,
  password,
  salt,
}: {
  hashedPassword: string;
  password: string;
  salt: string;
}) => {
  const hashedInputPassword = await hashPasswordHandle(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(hashedInputPassword, "hex"),
    Buffer.from(hashedPassword, "hex")
  );
};
