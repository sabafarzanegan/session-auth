import { cookies } from "next/headers";
import { getUserFromDb } from "./auth/action/formaction";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const Session_id = (await cookies()).get("session-id")?.value;
  const user = await getUserFromDb(Session_id as string);

  return (
    <div className=" mt-10">
      <Card className="w-full ">
        <CardContent className="space-y-3">
          <h1 className="text-2xl font-bold">
            Welcome {user?.name || "Guest"}
          </h1>
          <p>{user?.email}</p>
          <p>{user?.role}</p>
        </CardContent>
      </Card>
    </div>
  );
}
