export type LiveChannel={id:string;name:string;category:string;logo?:string;streamUrl:string;description?:string};

// Adicione somente streams próprios, licenciados ou oficialmente liberados para incorporação.
export const liveChannels:LiveChannel[]=[
{id:"demo-1",name:"Demo HLS 1",category:"Demonstração",streamUrl:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",description:"Stream público de demonstração técnica do player HLS."},
{id:"demo-2",name:"Demo HLS 2",category:"Demonstração",streamUrl:"https://test-streams.mux.dev/test_001/stream.m3u8",description:"Segundo stream público para validar reprodução ao vivo."}
];
