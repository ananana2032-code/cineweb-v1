# CineWeb V2.1 — TV ao Vivo

Novidades: TV ao Vivo, player HLS, busca e categorias de canais.

## Atualizar
1. Não apague seu `.env.local`.
2. Substitua os demais arquivos pelos desta versão.
3. Rode `npm.cmd install`.
4. Rode `npm.cmd run dev`.
5. Teste `/live`.
6. Depois: `git add .`, `git commit -m "CineWeb V2.1 TV ao Vivo"`, `git push`.

## Cadastrar canais autorizados
Edite `app/lib/live.ts` e adicione apenas streams próprios, licenciados ou oficialmente liberados.
