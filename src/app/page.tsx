import Hero from "@/components/noir/Hero";
import Featured from "@/components/noir/Featured";
import Constructor from "@/components/noir/Constructor";
import Calendar from "@/components/noir/Calendar";
import Match from "@/components/noir/Match";
import Index from "@/components/noir/Index";
import Pro from "@/components/noir/Pro";
import Colophon from "@/components/noir/Colophon";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Constructor />
      <Calendar />
      <Match />
      <Index />
      <Pro />
      <Colophon />
    </>
  );
}
