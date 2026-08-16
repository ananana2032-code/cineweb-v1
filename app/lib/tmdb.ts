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

const IMG = "https://image.tmdb.org/t/p/original";

function normalize(item: any, type: "movie" | "tv"): Media {
  const date = item.release_date || item.first_air_date || "";
  return {
    id: item.id,
    title: item.title || item.name || "Sem título",
    overview: item.overview || "Sinopse não disponível.",
    poster: item.poster_path ? `${IMG}${item.poster_path}` : "",
    backdrop: item.backdrop_path ? `${IMG}${item.backdrop_path}` : "",
    rating: Number(item.vote_average || 0),
    year: date ? String(date).slice(0, 4) : "",
    type
  };
}

const fallback: Media[] = [
  { id: 1, title: "Horizonte Final", overview: "Uma missão espacial precisa decidir entre voltar para casa ou atravessar o desconhecido.", poster: "", backdrop: "", rating: 8.4, year: "2026", type: "movie" },
  { id: 2, title: "Distrito 9 PM", overview: "Uma investigadora descobre uma rede de segredos que atravessa a cidade.", poster: "", backdrop: "", rating: 8.1, year: "2026", type: "tv" },
  { id: 3, title: "Código Aurora", overview: "Tecnologia, espionagem e uma corrida contra o tempo.", poster: "", backdrop: "", rating: 7.9, year: "2025", type: "movie" },
  { id: 4, title: "Última Fronteira", overview: "Sobreviventes tentam reconstruir uma comunidade em território hostil.", poster: "", backdrop: "", rating: 8.0, year: "2026", type: "tv" },
  { id: 5, title: "Velocidade Zero", overview: "Um piloto aposentado retorna para uma corrida que parecia impossível.", poster: "", backdrop: "", rating: 7.7, year: "2025", type: "movie" }
];

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

export async function getHome() {
  const [trending, movies, tv] = await Promise.all([
    fetchTMDB("/trending/all/week?language=pt-BR"),
    fetchTMDB("/movie/now_playing?language=pt-BR&region=BR"),
    fetchTMDB("/tv/popular?language=pt-BR")
  ]);

  if (!trending || !movies || !tv) {
    return {
      hero: fallback[0],
      trending: fallback,
      movies: fallback.filter(x => x.type === "movie"),
      tv: fallback.filter(x => x.type === "tv"),
      demo: true
    };
  }

  const trendItems: Media[] = trending.results.slice(0, 14).map((x: any) =>
    normalize(x, x.media_type === "tv" ? "tv" : "movie")
  );
  const movieItems: Media[] = movies.results.slice(0, 14).map((x: any) => normalize(x, "movie"));
  const tvItems: Media[] = tv.results.slice(0, 14).map((x: any) => normalize(x, "tv"));

  return {
    hero: trendItems.find(x => x.backdrop) || trendItems[0],
    trending: trendItems,
    movies: movieItems,
    tv: tvItems,
    demo: false
  };
}
