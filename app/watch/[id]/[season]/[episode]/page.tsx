import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import HlsPlayer from "@/components/HlsPlayer";
import { getCollection } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function WatchPage({params}:{params:Promise<{id:string;season:string;episode:string}>}) {
  const {id,season,episode}=await params;
  if(!ObjectId.isValid(id)) notFound();
  const doc=await (await getCollection()).findOne({_id:new ObjectId(id),published:true});
  const ep=doc?.seasons?.[Number(season)]?.episodes?.[Number(episode)];
  if(!doc || !ep) notFound();
  const hlsUrl=typeof ep.hlsUrl==="string"?ep.hlsUrl:"";
  const driveUrl=typeof ep.driveUrl==="string"?ep.driveUrl:"";
  const audios=Array.isArray(ep.audioVersions)?ep.audioVersions:[];
  return <><Nav/><main className="player-wrap">
    <p className="muted">{doc.title} / {ep.title}</p>
    <h1>{ep.title}</h1>
    <HlsPlayer hlsUrl={hlsUrl} driveUrl={driveUrl} title={ep.title}/>
    {audios.length>0 && <><h3>Audio versions</h3><div className="audio-list">
      {audios.map((a:any,i:number)=><a className="btn secondary" key={i} href={a.hlsUrl || a.driveUrl || "#"} target="_blank" rel="noreferrer">{a.language || `Audio ${i+1}`}</a>)}
    </div><p className="muted">These are separate audio-version links. For selectable audio tracks inside one player, provide an HLS master playlist with audio renditions.</p></>}
    <p className="muted">If the Drive preview does not play or seek reliably, use an HLS URL in the admin form.</p>
  </main></>;
}
