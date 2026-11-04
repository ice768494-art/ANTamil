"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Track = { id: number; name: string; lang?: string };
export default function HlsPlayer({ hlsUrl, driveUrl, title }: { hlsUrl?: string; driveUrl?: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;
    let hls: Hls | null = null;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const available = hls!.audioTracks.map((track, index) => ({
          id: index, name: track.name || track.lang || `Audio ${index + 1}`, lang: track.lang
        }));
        setTracks(available);
        setSelectedTrack(hls!.audioTrack);
      });
      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        const available = hls!.audioTracks.map((track, index) => ({
          id: index, name: track.name || track.lang || `Audio ${index + 1}`, lang: track.lang
        }));
        setTracks(available);
      });
      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_event, data) => setSelectedTrack(data.id));
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError("Unable to load this HLS stream. Check the manifest URL and CORS settings.");
      });
    } else {
      setError("This browser does not support HLS playback.");
    }
    return () => {
      hls?.destroy();
      hlsRef.current = null;
      setTracks([]);
    };
  }, [hlsUrl]);

  function chooseTrack(id: number) {
    if (hlsRef.current) {
      hlsRef.current.audioTrack = id;
      setSelectedTrack(id);
    }
  }

  if (hlsUrl) return <>
    <div className="video-box"><video ref={videoRef} controls playsInline aria-label={title} /></div>
    {tracks.length > 1 && <div className="audio-list" aria-label="Audio tracks">
      <strong style={{alignSelf:"center"}}>Audio:</strong>
      {tracks.map(track => <button key={track.id} className={selectedTrack === track.id ? "active" : ""} onClick={() => chooseTrack(track.id)}>{track.name}</button>)}
    </div>}
    {error && <p className="notice">{error}</p>}
  </>;
  const idMatch = driveUrl?.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]+)/);
  const preview = idMatch ? `https://drive.google.com/file/d/${idMatch[1]}/preview` : null;
  return <div className="video-box">
    {preview ? <iframe src={preview} allow="autoplay; fullscreen" allowFullScreen title={title}/> :
      <div style={{padding:20,color:"white"}}>No playable video URL has been added.</div>}
  </div>;
}
