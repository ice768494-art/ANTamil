import Link from "next/link";
export default function AnimeCard({ anime }: { anime: any }) {
  return <Link className="poster" href={`/anime/${anime._id}`}>
    {anime.poster ? <img src={anime.poster} alt={anime.title} loading="lazy"/> : <div className="fallback">{anime.title}</div>}
    <div className="poster-title">{anime.title}</div>
  </Link>;
}
