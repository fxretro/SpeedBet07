#!/bin/bash

rm -rf /tmp/bet/
mkdir /tmp/bet/
/home/diego/Documentos/Projetos/Ghost/SpeedBet07/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/jogos.aspx?idesporte=102&idcampeonato=574583" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

python ./uteis/scrape.py


