"use client";

import { useMemo, useState } from "react";
import { Search, Play, Plus, Star, Film, Tv, Home, UserRound } from "lucide-react";
import type { Media } from "../lib/tmdb";

type Props = {
  data: {
    hero: Media;
    trending: Media[];
    movies: Media[];
    tv: Media[];
    demo: boolean;
  };
};

function Card({ item, onOpen }: { item: Media; onOpen: (m: Media) => void }) {
  return (
    <button className="card" onClick={() => onOpen(item)}>
      <div className="poster">
        {item.poster ? <img src={item.poster} alt={item.title} /> : <div className="placeholder"><Film size={32}/></div>}
        <span className="score"><Star size={13} fill="currentColor"/> {item.rating.toFixed(1)}</span>
      </div>
      <div className="cardTitle">{item.title}</div>
      <div className="meta">{item.year || "—"} · {item.type === "tv" ? "Série" : "Filme"}</div>
    </button>
  );
}

function Rail({ title, items, onOpen }: { title: string; items: Media[]; onOpen: (m: Media) => void }) {
  return (
    <section className="rail">
      <div className="sectionTitle"><h2>{title}</h2><span>Ver tudo</span></div>
      <div className="row">{items.map(i => <Card item={i} key={`${i.type}-${i.id}`} onOpen={onOpen}/>)}</div>
    </section>
  );
}

export default function HomeClient({ data }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Media | null>(null);

  const all = useMemo(() => {
    const map = new Map<string, Media>();
    [...data.trending, ...data.movies, ...data.tv].forEach(x => map.set(`${x.type}-${x.id}`, x));
    return [...map.values()];
  }, [data]);

  const results = query.trim()
    ? all.filter(x => x.title.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const hero = data.hero;

  return (
    <main>
      <header className="nav">
        <div className="brand">CINE<span>WEB</span></div>
        <nav className="desktopNav">
          <a className="active"><Home size={17}/> Início</a>
          <a><Film size={17}/> Filmes</a>
          <a><Tv size={17}/> Séries</a>
        </nav>
        <div className="searchWrap">
          <Search size={18}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar filmes e séries..." />
        </div>
        <button className="avatar"><UserRound size={20}/></button>
      </header>

      {query.trim() ? (
        <div className="searchPage">
          <h1>Resultados para “{query}”</h1>
          <div className="grid">
            {results.length ? results.map(i => <Card item={i} key={`${i.type}-${i.id}`} onOpen={setSelected}/>) : <p>Nenhum título encontrado.</p>}
          </div>
        </div>
      ) : (
        <>
          <section className="hero" style={hero?.backdrop ? { backgroundImage: `linear-gradient(90deg, #08090d 2%, rgba(8,9,13,.8) 38%, rgba(8,9,13,.25) 75%, #08090d 100%), linear-gradient(0deg, #08090d 0%, transparent 40%), url(${hero.backdrop})` } : {}}>
            <div className="heroContent">
              <span className="eyebrow">DESTAQUE DA SEMANA</span>
              <h1>{hero?.title || "CineWeb"}</h1>
              <div className="heroMeta"><b>{hero?.year}</b><span><Star size={15} fill="currentColor"/> {hero?.rating?.toFixed(1)}</span><span>{hero?.type === "tv" ? "Série" : "Filme"}</span></div>
              <p>{hero?.overview}</p>
              <div className="actions">
                <button className="primary" onClick={() => setSelected(hero)}><Play size={19} fill="currentColor"/> Ver detalhes</button>
                <button className="secondary"><Plus size={20}/> Minha lista</button>
              </div>
            </div>
          </section>

          {data.demo && <div className="demoBanner">Modo demonstração: adicione <b>TMDB_READ_TOKEN</b> nos Secrets do Replit para carregar o catálogo real.</div>}

          <Rail title="Em alta" items={data.trending} onOpen={setSelected}/>
          <Rail title="Filmes em destaque" items={data.movies} onOpen={setSelected}/>
          <Rail title="Séries populares" items={data.tv} onOpen={setSelected}/>
        </>
      )}

      {selected && (
        <div className="modalBack" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <div className="modalBackdrop" style={selected.backdrop ? { backgroundImage: `linear-gradient(0deg,#111319 0%,transparent 70%),url(${selected.backdrop})` } : {}}/>
            <div className="modalBody">
              <h2>{selected.title}</h2>
              <div className="heroMeta"><span><Star size={15} fill="currentColor"/> {selected.rating.toFixed(1)}</span><span>{selected.year}</span><span>{selected.type === "tv" ? "Série" : "Filme"}</span></div>
              <p>{selected.overview}</p>
              <button className="primary" disabled><Play size={18}/> Player entra na V2</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
