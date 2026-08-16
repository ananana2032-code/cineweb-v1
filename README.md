# CineWeb V2.2

## Novidades
- Lançamentos no cinema no Brasil
- Filmes "Em breve"
- Séries no ar
- Séries populares
- Onde assistir no Brasil
- Provedores por assinatura, aluguel, compra, gratuito e com anúncios
- Mantém trailers, temporadas, episódios, Minha Lista e TV ao Vivo

## Atualização
1. NÃO apague o seu `.env.local`.
2. Extraia este ZIP.
3. Copie todos os arquivos para a pasta atual do projeto.
4. Substitua os arquivos quando o Windows perguntar.
5. Confirme que `.env.local` continua existindo.
6. Rode:

npm.cmd install
npm.cmd run dev

7. Teste a página inicial e abra um filme/série.
8. Confira a seção "Onde assistir no Brasil".

## Publicação
Depois de testar:

git add .
git commit -m "CineWeb V2.2 catalogo e onde assistir"
git push

A Vercel fará o deploy automaticamente.

## Importante
O TMDB fornece metadados, imagens, trailers/referências e dados de disponibilidade. Ele não fornece os arquivos completos de filmes e episódios.
