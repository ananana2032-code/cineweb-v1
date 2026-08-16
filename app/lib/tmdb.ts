export type Media = {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: string;
  type: "movie" | "tv";
};

export type Episode = {
  id: number;
  number: number;
  name: string;
  overview: string;
  still: string;
  airDate: string;
  runtime?: number;
};

export type Season = {
  id: number;
  number: number;
  name: string;
  episodeCount: number;
  poster: string;
  airDate: string;
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
};

export type WatchProviders = {
  link?: string;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  free: WatchProvider[];
  ads: WatchProvider[];
};

export type Detail = Media & {
  genres: string[];
  runtime?: number;
  status?: string;
  seasons?: Season[];
  trailerKey?: string;
  recommendations: Media[];
  watchProviders: WatchProviders;
};

const IMG = "https://image.tmdb.org/t/p/original";
const IMG500 = "https://image.tmdb.org/t/p/w500";
const IMG92 = "https://image.tmdb.org/t/p/w92";

function mediaType(item: any): "movie" | "tv" {
  return item.media_type === "tv" || (!item.title && !!item.name) ? "tv" : "movie";
}

export function normalize(item: any, forcedType?: "movie" | "tv"): Media {
  const type = forcedType || mediaType(item);
  const date = item.release_date || item.first_air_date || "";
  return {
    id: Number(item.id),
    title: item.title || item.name || "Sem título",
    overview: item.overview || "Sinopse não disponível.",
    poster: item.poster_path ? `${IMG500}${item.poster_path}` : "",
    backdrop: item.backdrop_path ? `${IMG}${item.backdrop_path}` : "",
    rating: Number(item.vote_average || 0),
    year: date ? String(date).slice(0, 4) : "",
    type
  };
}

async function fetchTMDB(path: string) {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 1800 }
  });
  if (!res.ok) return null;
  return res.json();
}

const demo: Media[] = [
  { id: 1, title: "Horizonte Final", overview: "Uma missão espacial precisa decidir entre voltar para casa ou atravessar o desconhecido.", poster: "", backdrop: "", rating: 8.4, year: "2026", type: "movie" },
  { id: 2, title: "Distrito 9 PM", overview: "Uma investigadora descobre uma rede de segredos que atravessa a cidade.", poster: "", backdrop: "", rating: 8.1, year: "2026", type: "tv" },
  { id: 3, title: "Código Aurora", overview: "Tecnologia, espionagem e uma corrida contra o tempo.", poster: "", backdrop: "", rating: 7.9, year: "2025", type: "movie" },
  { id: 4, title: "Última Fronteira", overview: "Sobreviventes tentam reconstruir uma comunidade em território hostil.", poster: "", backdrop: "", rating: 8.0, year: "2026", type: "tv" }
];

export async function getHome() {
  const [trending, nowPlaying, upcoming, onAir, popularTv, top] = await Promise.all([
    fetchTMDB("/trending/all/week?language=pt-BR"),
    fetchTMDB("/movie/now_playing?language=pt-BR&region=BR"),
    fetchTMDB("/movie/upcoming?language=pt-BR&region=BR"),
    fetchTMDB("/tv/on_the_air?language=pt-BR"),
    fetchTMDB("/tv/popular?language=pt-BR"),
    fetchTMDB("/movie/top_rated?language=pt-BR")
  ]);

  if (!trending || !nowPlaying || !upcoming || !onAir || !popularTv || !top) {
    return {
      hero: demo[0],
      trending: demo,
      nowPlaying: demo.filter(x=>x.type==="movie"),
      upcoming: demo.filter(x=>x.type==="movie"),
      onAir: demo.filter(x=>x.type==="tv"),
      popularTv: demo.filter(x=>x.type==="tv"),
      top: demo,
      demo: true
    };
  }

  const trendItems = trending.results.slice(0,18).map((x:any)=>normalize(x));
  return {
    hero: trendItems.find((x:Media)=>x.backdrop) || trendItems[0],
    trending: trendItems,
    nowPlaying: nowPlaying.results.slice(0,18).map((x:any)=>normalize(x,"movie")),
    upcoming: upcoming.results.slice(0,18).map((x:any)=>normalize(x,"movie")),
    onAir: onAir.results.slice(0,18).map((x:any)=>normalize(x,"tv")),
    popularTv: popularTv.results.slice(0,18).map((x:any)=>normalize(x,"tv")),
    top: top.results.slice(0,18).map((x:any)=>normalize(x,"movie")),
    demo: false
  };
}

export async function searchMedia(query: string) {
  const data = await fetchTMDB(`/search/multi?language=pt-BR&include_adult=false&query=${encodeURIComponent(query)}`);
  if (!data) return [];
  return (data.results || [])
    .filter((x:any)=>x.media_type==="movie" || x.media_type==="tv")
    .slice(0,30)
    .map((x:any)=>normalize(x));
}

function normalizeProviders(data:any): WatchProviders {
  const br = data?.results?.BR || {};
  const norm = (arr:any[] = []) => arr.map(p=>({
    provider_id: p.provider_id,
    provider_name: p.provider_name,
    logo_path: p.logo_path ? `${IMG92}${p.logo_path}` : undefined
  }));
  return {
    link: br.link,
    flatrate: norm(br.flatrate),
    rent: norm(br.rent),
    buy: norm(br.buy),
    free: norm(br.free),
    ads: norm(br.ads)
  };
}

export async function getDetail(type: "movie"|"tv", id: string): Promise<Detail | null> {
  const [data, videos, recs, providers] = await Promise.all([
    fetchTMDB(`/${type}/${id}?language=pt-BR`),
    fetchTMDB(`/${type}/${id}/videos?language=pt-BR`),
    fetchTMDB(`/${type}/${id}/recommendations?language=pt-BR`),
    fetchTMDB(`/${type}/${id}/watch/providers`)
  ]);
  if (!data) return null;

  const trailer = (videos?.results || []).find((v:any)=>v.site==="YouTube" && v.type==="Trailer")
    || (videos?.results || []).find((v:any)=>v.site==="YouTube");

  const m = normalize(data, type);
  return {
    ...m,
    genres: (data.genres || []).map((g:any)=>g.name),
    runtime: type==="movie" ? data.runtime : data.episode_run_time?.[0],
    status: data.status,
    seasons: type==="tv" ? (data.seasons || [])
      .filter((s:any)=>s.season_number > 0)
      .map((s:any)=>({
        id:s.id,
        number:s.season_number,
        name:s.name,
        episodeCount:s.episode_count,
        poster:s.poster_path ? `${IMG500}${s.poster_path}` : "",
        airDate:s.air_date || ""
      })) : [],
    trailerKey: trailer?.key,
    recommendations: (recs?.results || []).slice(0,14).map((x:any)=>normalize(x,type)),
    watchProviders: normalizeProviders(providers)
  };
}

export async function getSeason(tvId: string, seasonNumber: string): Promise<Episode[]> {
  const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}?language=pt-BR`);
  if (!data) return [];
  return (data.episodes || []).map((e:any)=>({
    id:e.id,
    number:e.episode_number,
    name:e.name || `Episódio ${e.episode_number}`,
    overview:e.overview || "Sinopse não disponível.",
    still:e.still_path ? `${IMG500}${e.still_path}` : "",
    airDate:e.air_date || "",
    runtime:e.runtime
  }));
}
