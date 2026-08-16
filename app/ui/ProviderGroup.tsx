"use client";
import type { WatchProvider } from "../lib/tmdb";

export default function ProviderGroup({title,items}:{title:string;items:WatchProvider[]}){
  if(!items.length) return null;
  return <div className="providerGroup">
    <h3>{title}</h3>
    <div className="providerRow">
      {items.map(p=><div className="provider" key={p.provider_id} title={p.provider_name}>
        {p.logo_path ? <img src={p.logo_path} alt={p.provider_name}/> : <div className="providerFallback">{p.provider_name.slice(0,2)}</div>}
        <span>{p.provider_name}</span>
      </div>)}
    </div>
  </div>
}
