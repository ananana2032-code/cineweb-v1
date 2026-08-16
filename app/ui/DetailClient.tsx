"use client";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Heart, Play, Star, X } from "lucide-react";
import Header from "./Header";
import MediaCard from "./MediaCard";
import ProviderGroup from "./ProviderGroup";
import type { Detail, Episode } from "../lib/tmdb";
import { addHistory, isFavorite, toggleFavorite } from "./storage";

export default function DetailClient({detail}:{detail:Detail}){
  const [fav,setFav]=useState(false);
  const [trailer,setTrailer]=useState(false);
  const [season,setSeason]=useState(detail.seasons?.[0]?.number || 1);
  const [episodes,setEpisodes]=useState<Episode[]>([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    setFav(isFavorite(detail));
    addHistory(detail);
  },[detail]);

  useEffect(()=>{
    if(detail.type!=="tv") return;
    setLoading(true);
    fetch(`/api/season?tvId=${detail.id}&season=${season}`)
      .then(r=>r.json()).then(d=>setEpisodes(d.episodes||[]))
      .finally(()=>setLoading(false));
  },[detail.id,detail.type,season]);

  const wp = detail.watchProviders;
  const hasProviders = wp.flatrate.length || wp.rent.length || wp.buy.length || wp.free.length || wp.ads.length;

  return <main>
    <Header/>
    <section className="detailHero" style={detail.backdrop?{backgroundImage:`linear-gradient(90deg,#08090d 3%,rgba(8,9,13,.82) 42%,rgba(8,9,13,.2) 78%),linear-gradient(0deg,#08090d 0%,transparent 45%),url(${detail.backdrop})`}:{}}>
      <div className="detailContent">
        <span className="eyebrow">{detail.type==="tv"?"SÉRIE":"FILME"}</span>
        <h1>{detail.title}</h1>
        <div className="heroMeta"><span><Star size={15} fill="currentColor"/> {detail.rating.toFixed(1)}</span><span>{detail.year}</span>{detail.runtime?<span>{detail.runtime} min</span>:null}<span>{detail.status}</span></div>
        <div className="genres">{detail.genres.map(g=><span key={g}>{g}</span>)}</div>
        <p>{detail.overview}</p>
        <div className="actions">
          {detail.trailerKey && <button className="primary" onClick={()=>setTrailer(true)}><Play size={19} fill="currentColor"/> Assistir trailer</button>}
          <button className="secondary" onClick={()=>setFav(toggleFavorite(detail))}>{fav?<Check size={20}/>:<Heart size={20}/>} {fav?"Na minha lista":"Minha lista"}</button>
          {wp.link && <a className="secondary" target="_blank" rel="noreferrer" href={wp.link}><ExternalLink size={18}/> Onde assistir</a>}
        </div>
      </div>
    </section>

    <section className="contentSection watchSection">
      <div className="sectionTitle"><h2>Onde assistir no Brasil</h2></div>
      {hasProviders ? <>
        <ProviderGroup title="Streaming por assinatura" items={wp.flatrate}/>
        <ProviderGroup title="Grátis" items={wp.free}/>
        <ProviderGroup title="Grátis com anúncios" items={wp.ads}/>
        <ProviderGroup title="Alugar" items={wp.rent}/>
        <ProviderGroup title="Comprar" items={wp.buy}/>
        <p className="providerNote">Disponibilidade informada pelo TMDB/JustWatch e pode mudar conforme região e data.</p>
      </> : <p className="muted">Nenhum provedor informado para o Brasil no momento.</p>}
    </section>

    {detail.type==="tv" && detail.seasons && detail.seasons.length>0 && <section className="contentSection">
      <div className="seasonHead">
        <h2>Temporadas e episódios</h2>
        <select value={season} onChange={e=>setSeason(Number(e.target.value))}>
          {detail.seasons.map(s=><option key={s.number} value={s.number}>{s.name} · {s.episodeCount} episódios</option>)}
        </select>
      </div>
      {loading?<p className="muted">Carregando episódios...</p>:<div className="episodes">
        {episodes.map(ep=><article className="episode" key={ep.id}>
          <div className="episodeImg">{ep.still?<img src={ep.still} alt={ep.name}/>:<div className="placeholder"/>}<span>{ep.number}</span></div>
          <div><h3>{ep.name}</h3><div className="meta">{ep.airDate}{ep.runtime?` · ${ep.runtime} min`:""}</div><p>{ep.overview}</p></div>
        </article>)}
      </div>}
    </section>}

    {detail.recommendations.length>0 && <section className="rail detailRail">
      <div className="sectionTitle"><h2>Você também pode gostar</h2></div>
      <div className="row">{detail.recommendations.map(i=><MediaCard item={i} key={`${i.type}-${i.id}`}/>)}</div>
    </section>}

    {trailer && detail.trailerKey && <div className="modalBack" onClick={()=>setTrailer(false)}>
      <div className="videoModal" onClick={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setTrailer(false)}><X/></button>
        <iframe src={`https://www.youtube.com/embed/${detail.trailerKey}?autoplay=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={`Trailer ${detail.title}`}/>
      </div>
    </div>}
  </main>
}
