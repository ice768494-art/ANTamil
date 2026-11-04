import Nav from "@/components/Nav";
import AnimeCard from "@/components/AnimeCard";
import { getCollection } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function Home() {
  let anime: any[] = [];
  try {
    const collection = await getCollection();
    anime = await collection.find({ published: true }).sort({ createdAt: -1 }).toArray();
  } catch { /* Show setup message if database is not configured yet. */ }
  return <>
    <Nav/>
    <section className="hero"><div>
      <p style={{color:"#ff5962",fontWeight:800,letterSpacing:3}}>YOUR ANIME DESTINATION</p>
      <h1>Anime Network Tamil</h1>
      <p>Discover your next series. Browse anime, seasons and episodes in one place.</p>
      <a className="btn" href="#catalogue">Explore Anime</a>
    </div></section>
    <main className="container" id="catalogue">
      <h2 className="section-title">Popular Anime</h2>
      {anime.length ? <div className="grid">{anime.map(item=><AnimeCard key={String(item._id)} anime={{...item,_id:String(item._id)}}/>)}</div> :
        <div className="notice">Your catalogue is empty or the database is not configured. Open the Admin page after setting up MongoDB to add your first title.</div>}
    </main>
    <footer>© {new Date().getFullYear()} Anime Network Tamil. Only publish videos and artwork you own or are authorized to distribute.</footer>
  </>;
}
