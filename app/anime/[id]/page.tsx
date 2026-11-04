import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { getCollection } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function AnimePage({ params }: { params: Promise<{id:string}> }) {
  const {id} = await params;
  if (!ObjectId.isValid(id)) notFound();
  const collection = await getCollection();
  const anime = await collection.findOne({_id:new ObjectId(id),published:true});
  if (!anime) notFound();
  const seasons = (anime.seasons || []) as any[];
  return <>
    <Nav/>
    <section className="detail-hero">
      {anime.poster && <img src={anime.poster} alt={anime.title}/>}
      <div><p className="muted">ANIME NETWORK TAMIL</p><h1>{anime.title}</h1>
        <p className="muted">{anime.year || ""} {anime.genre || ""}</p><p>{anime.description}</p></div>
    </section>
    <main className="container">
      <h2 className="section-title">Episodes</h2>
      {seasons.map((season:any, si:number)=><section className="season" key={si}>
        <h3>{season.name || `Season ${si+1}`}</h3>
        {(season.episodes || []).map((ep:any, ei:number)=><div className="episode" key={ei}>
          <div><strong>{ep.title || `Episode ${ei+1}`}</strong><div className="muted">{ep.duration || ""}</div></div>
          <Link className="btn" href={`/watch/${id}/${si}/${ei}`}>Watch</Link>
        </div>)}
      </section>)}
      {!seasons.length && <p className="muted">No episodes have been added yet.</p>}
    </main><footer>Anime Network Tamil</footer>
  </>;
}
