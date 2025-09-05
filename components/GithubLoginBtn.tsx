import { Github } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

function GithubLoginBtn() {
  return (
    <Button className="w-[100px]  h-[50px] bg-transparent border-[#DDDFDD] hover:bg-transparent shadow-2xl">
      <Image
        src="/github.png"
        width={28}
        height={28}
        alt="googleicon"
        className="w-[20px] h-[20px]"
      />
    </Button>
  );
}

export default GithubLoginBtn;
