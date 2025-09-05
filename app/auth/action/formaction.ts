"use server";

import prisma from "@/lib/prisma";
import {
  createUserSession,
  generateSalt,
  hashPasswordHandle,
} from "@/lib/services";
import { signupFormSchema } from "@/lib/zod-schema";
import { cookies } from "next/headers";
import z from "zod";

export async function registerHandle(
  formData: z.infer<typeof signupFormSchema>
) {
  const { success, data } = signupFormSchema.safeParse(formData);
  if (!success) return "Unable to create account";
  //   checking if a user exist in db with this email
  const existingUser = await prisma.user.findFirst({
    where: {
      email: formData.email,
    },
  });
  if (existingUser != null) return "Account already exists for this email";
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
        name: "",
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (user == null) return "Unable to create account";

    // create session for user based on id and role of user
    await createUserSession(user, await cookies());
  } catch (error) {
    console.log(error);
  }
}
