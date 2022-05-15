# Require: ImageMagick
mkdir emoji

# sevenwonders
curl -O https://x.boardgamearena.net/data/themereleases/current/games/sevenwonders/201016-1401/img/icons_v2.png
convert icons_v2.png -crop 20x20+90+40 ./emoji/sicon_mcoin.png
convert icons_v2.png -crop 20x20+90+20 ./emoji/sicon_W.png
convert icons_v2.png -crop 20x20+90+0 ./emoji/sicon_S.png
convert icons_v2.png -crop 20x20+110+0 ./emoji/sicon_C.png
convert icons_v2.png -crop 20x20+110+20 ./emoji/sicon_L.png
convert icons_v2.png -crop 20x20+130+0 ./emoji/sicon_O.png
convert icons_v2.png -crop 20x20+130+20 ./emoji/sicon_G.png
convert icons_v2.png -crop 20x20+130+40 ./emoji/sicon_P.png

rm icons_v2.png