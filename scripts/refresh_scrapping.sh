#!/bin/bash


rm -rf /tmp/bet/
mkdir /tmp/bet/
#/home/diego/Documentos/Projetos/Ghost/Ghost-Bet/scripts/save_page_as.sh "https://www.bet365.com/#/IP/B1" --browser "firefox" --destination "/tmp/bet/bet.html" --load-wait-time 5

python ./uteis/scrape_fifa.py

