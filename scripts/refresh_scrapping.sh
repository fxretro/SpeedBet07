#!/bin/bash

rm -rf /tmp/bet/
mkdir /tmp/bet/

/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/jogos.aspx?idesporte=102&idcampeonato=574908" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

python ./uteis/scrape.py


