#!/bin/bash

rm -rf /tmp/bet/
mkdir /tmp/bet/
/home/diego/Documentos/Projetos/Ghost/SpeedBet07/scripts/save_page_as.sh "https://www.flashscore.com.br" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

python ./uteis/results.py

