"use client";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { signupFormSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import GoogleLoginBtn from "./GoogleLoginBtn";
import GithubLoginBtn from "./GithubLoginBtn";
import { registerHandle } from "@/app/auth/action/formaction";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    console.log(values);
    try {
      const res = await registerHandle(values);
      if (!res.success) {
        return toast.error(res.message);
      }
      toast.success(res.message);
      router.push("/");
    } catch (error) {}
  }

  return (
    <div className="w-[300px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    {...field}
                    className="h-[40px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    {...field}
                    className="h-[40px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    {...field}
                    className="h-[40px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            className="w-full h-[40px]"
            type="submit">
            {form.formState.isSubmitting ? "loading..." : "submit"}
          </Button>
        </form>
      </Form>

      {/* oauth section */}
      <div className="text-[#ACADAC] text-sm flex items-center justify-center flex-col gap-y-[21px] mt-8">
        <div className="">
          <p className="relative after:absolute after:content[``] after:w-[96px] after:h-[1px] after:bg-[#ACADAC] after:left-28 after:top-1/2 after:-translate-y-1/2 before:absolute before:content[``] before:w-[96px] before:h-[1px] before:bg-[#ACADAC] before:right-28 before:top-1/2 before:-translate-y-1/2">
            Or continue with
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <GoogleLoginBtn />
          <GithubLoginBtn />
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
