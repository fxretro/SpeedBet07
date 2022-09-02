#!/bin/bash

rm -rf /tmp/bet/
mkdir /tmp/bet/


# JOGOS AO VIVO
#/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/AoVivo.aspx" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

# BRASILEIRÃO SERIE A
#/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/jogos.aspx?idesporte=102&idcampeonato=100000325" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

# BRASILEIRÃO SERIE B
#/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/jogos.aspx?idesporte=102&idcampeonato=100000328" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

# JOGOS DO DIA
/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://oficialbet.com/sistema_v2/usuarios/simulador/desktop/jogos.aspx?idesporte=102&idcampeonato=575067" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

python ./uteis/scrape.py


