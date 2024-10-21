import Image from "next/image";
import Button from "./ui/button";
import ForumPage from "./forum/page";
export default function Home() {
  return (
    <ForumPage
      searchParams={{
        search: undefined,
      }}
    />
  );
}
