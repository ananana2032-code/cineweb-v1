import HomeClient from "./ui/HomeClient";
import { getHome } from "./lib/tmdb";

export default async function Home() {
  const data = await getHome();
  return <HomeClient data={data} />;
}
