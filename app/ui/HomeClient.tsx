"use client";
import Link from "next/link";
import { Play, Plus, Radio, Star } from "lucide-react";
import Header from "./Header";
import MediaCard from "./MediaCard";
import type { Media } from "../lib/tmdb";
import { history, toggleFavorite } from "./storage";
import { useEffect, useState } from "react";

type Props={data:{
  hero:Media; trending:Media[]; nowPlaying:Media[]; upcoming:Media[];
  onAir:Media[]; popularTv:Media[]; top:Media[]; demo:boolean;
}};

function Rail({title,items}:{title:string;items:Media[]}){
  return <section className="rail">
    <div className="sectionTitle"><h2>{title}</h2></div>
    <div className="row">{items.map(i=><MediaCard item={i} key={`${i.type}-${i.id}`}/>)}</div>
  </section>
}

export default function HomeClient({data}:Props){
  const [recent,setRecent]=useState<Media[]>([]);
  useEffect(()=>{
    const load=()=>setRecent(history());
    load(); window.addEventListener("cineweb-storage",load);
    return()=>window.removeEventListener("cineweb-storage",load);
  },[]);
  const h=data.hero;

  return <main>
    <Header/>
    <section className="hero" style={h?.backdrop?{backgroundImage:`linear-gradient(90deg,#08090d 2%,rgba(8,9,13,.82) 38%,rgba(8,9,13,.18) 76%,#08090d 100%),linear-gradient(0deg,#08090d 0%,transparent 45%),url(${h.backdrop})`}:{}}>
      <div className="heroContent">
        <span className="eyebrow">DESTAQUE DA SEMANA</span>
        <h1>{h.title}</h1>
        <div className="heroMeta"><b>{h.year}</b><span><Star size={15} fill="currentColor"/> {h.rating.toFixed(1)}</span><span>{h.type==="tv"?"Série":"Filme"}</span></div>
        <p>{h.overview}</p>
        <div className="actions">
          <Link className="primary" href={`/title/${h.type}/${h.id}`}><Play size={19} fill="currentColor"/> Ver detalhes</Link>
          <button className="secondary" onClick={()=>toggleFavorite(h)}><Plus size={20}/> Minha lista</button>
          <Link className="secondary" href="/live"><Radio size={20}/> TV ao Vivo</Link>
        </div>
      </div>
    </section>
    {data.demo && <div className="demoBanner">Modo demonstração. Configure <b>TMDB_READ_TOKEN</b>.</div>}
    {recent.length>0 && <Rail title="Vistos recentemente" items={recent}/>}
    <Rail title="Em alta agora" items={data.trending}/>
    <Rail title="Lançamentos no cinema" items={data.nowPlaying}/>
    <Rail title="Em breve" items={data.upcoming}/>
    <Rail title="Séries no ar" items={data.onAir}/>
    <Rail title="Séries populares" items={data.popularTv}/>
    <Rail title="Mais bem avaliados" items={data.top}/>
    <footer className="footer">Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.</footer>
  </main>
}
