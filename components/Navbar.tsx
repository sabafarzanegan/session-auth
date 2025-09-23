"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getUserFromDb, logOut } from "@/app/auth/action/formaction";
import { User } from "@/lib/types";
import { Loader2 } from "lucide-react";

const navLinkItems = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
];

function Navbar({ session_id }: { session_id: string | undefined }) {
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User | null | undefined>(null);
  const pathname = usePathname();
  useEffect(() => {
    const getUser = async () => {
      try {
        if (session_id) {
          const user = await getUserFromDb(session_id);
          console.log(user);

          setUser(user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  console.log("user in nav", user);

  return (
    <header
      className="flex items-center justify-between mt-[98px] 
    ">
      {/* navlinks */}
      <nav>
        <ul className="flex items-center  gap-x-[40px] text-sm font-[450]">
          {navLinkItems.map((item) => (
            <li key={item.id}>
              <Link href={item.link}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* auth links */}
      {user ? (
        // <p>{user.email}</p>
        <Button
          onClick={() => {
            startTransition(async () => {
              await logOut();
              window.location.reload();
            });
          }}
          variant="destructive">
          {isPending ? (
            <Loader2 className="animate-spin duration-200 block" />
          ) : (
            "logout"
          )}
        </Button>
      ) : (
        <div
          className="flex items-center 
      ">
          {/* sign in  */}

          <div>
            <Button variant="link" asChild className=" font-semibold">
              <Link
                href="/auth/sign-in"
                className={`no-underline hover:no-underline relative after:absolute after:bottom-0 after:left-6 after:h-[3px] ${
                  pathname.includes("sign") ? "after:w-[26px]" : "after:w-0"
                }  after:bg-primary after:transition-all after:duration-300 hover:after:w-[26px]`}>
                Sign in
              </Link>
            </Button>
          </div>

          {/* register */}
          <Button
            className="w-[112px] h-[42px] rounded-[999rem] bg-white hover:bg-white"
            variant="outline">
            <Link href="/auth/register" className="text-primary font-semibold ">
              Register
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
