import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";
import Link from "next/link";
import img from "../../../public/Character 1.png";

function page() {
  return (
    <div className="flex items-center justify-center md:justify-between flex-col gap-y-8 gap-x-4 md:flex-row py-4 ">
      {/* text */}
      <div>
        <div className="text-[2.5rem] font-bold">
          <h1>Sign Up to</h1>
          <h1>Recharge Direct</h1>
        </div>
        <div>
          <p>if you have an account </p>
          <p>
            you can{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-semibold relative after:w-[226px]  after:
            h-[226px] after:bg-primary after:rounded-full after:absolute after:-inset-10 after:blur-3xl after:opacity-50 after:z-10 after:content-['']">
              Login!
            </Link>{" "}
          </p>
        </div>
      </div>
      {/* image */}
      <div className="hidden md:block">
        <Image
          src={img}
          width={500}
          height={400}
          alt=""
          className="object-contain max-w-[500px] w-full h-auto"
        />
      </div>
      <SignUpForm />
    </div>
  );
}

export default page;
