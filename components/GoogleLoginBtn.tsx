import Image from "next/image";
import { Button } from "./ui/button";

function GoogleLoginBtn() {
  return (
    <Button className="w-[100px]  h-[50px] bg-transparent border-[#DDDFDD] hover:bg-transparent shadow-2xl">
      <Image
        src="/Google.svg"
        width={28}
        height={28}
        alt="googleicon"
        className="w-[20px] h-[20px]"
      />
    </Button>
  );
}

export default GoogleLoginBtn;
