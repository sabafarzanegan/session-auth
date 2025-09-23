"use server";

import prisma from "@/lib/prisma";
import {
  comparePassword,
  createUserSession,
  generateSalt,
  hashPasswordHandle,
  removeUserFromSession,
} from "@/lib/services";
import { userRedis } from "@/lib/types";
import { signinFormSchema, signupFormSchema } from "@/lib/zod-schema";
import { redisClient } from "@/redis/redis";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function registerHandle(
  formData: z.infer<typeof signupFormSchema>
) {
  const { success, data } = signupFormSchema.safeParse(formData);
  if (!success) return { success: false, message: "Unable to create account" };

  //   checking if a user exist in db with this email
  const existingUser = await prisma.user.findFirst({
    where: {
      email: formData.email,
    },
  });
  if (existingUser != null)
    return { success: false, message: "Account already exists for this email" };

  try {
    // generate salt for session
    const salt = generateSalt();

    // hashing pass
    const hashedPassword = await hashPasswordHandle(formData.password, salt);

    // now create user in db
    const user = await prisma.user.create({
      data: {
        email: formData.email,
        password: hashedPassword,
        salt: salt,
        name: formData.name,
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (user == null)
      return { success: false, message: "Unable to create account" };

    // create session for user based on id and role of user
    await createUserSession(user, await cookies());
    revalidatePath("/");
    return { success: true, message: "register successfully!" };
  } catch (error) {
    return { success: false, message: "Unable to create account" };
  }
}

export const loginHandler = async (
  formData: z.infer<typeof signinFormSchema>
) => {
  const { success } = signinFormSchema.safeParse(formData);
  if (!success) return { success: false, message: "Unable to create account" };

  const user = await prisma.user.findFirst({
    where: {
      email: formData.email,
    },
  });
  if (!user) return { success: false, message: "you do not register yet" };

  const isCorrectPassword = await comparePassword({
    hashedPassword: user.password,
    password: formData.password,
    salt: user.salt,
  });
  if (!isCorrectPassword)
    return { success: false, message: "password is not correct" };

  await createUserSession(user, await cookies());
  return { success: true, message: "logged in successfully" };
};

export const getUserFromDb = async (session_id: string) => {
  try {
    const userInRedis: userRedis = await redisClient.get(
      `session:${session_id}`
    );
    console.log(userInRedis);

    if (!userInRedis) return null;
    const userInDb = await prisma.user.findFirst({
      where: {
        id: userInRedis.data.id,
      },
    });
    return userInDb;
  } catch (error) {
    console.log(error);
  }
};

export const logOut = async () => {
  await removeUserFromSession(await cookies());
};
