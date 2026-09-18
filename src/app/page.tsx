import Hero from "@/components/afisha/Hero";
import Acts from "@/components/afisha/Acts";
import PosterWall from "@/components/afisha/PosterWall";
import Program from "@/components/afisha/Program";
import Repertoire from "@/components/afisha/Repertoire";
import Kasa from "@/components/afisha/Kasa";
import Today from "@/components/afisha/Today";
import Backstage from "@/components/afisha/Backstage";
import Credits from "@/components/afisha/Credits";

// Едиція «Афіша»: театральна подієва афіша. Попередня едиція (Editorial
// Noir) лишається в src/components/noir/ — щоб повернутись, поверніть
// імпорти noir/* і приберіть обгортку .afisha.
export default function Home() {
  return (
    <div className="afisha">
      <Hero />
      <Acts />
      <PosterWall />
      <Program />
      <Repertoire />
      <Kasa />
      <Today />
      <Backstage />
      <Credits />
    </div>
  );
}
