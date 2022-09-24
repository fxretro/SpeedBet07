from logging import exception
import time
import database as Db
import odds as Odds
import os
import numpy

def start():    

    print('Vericando bets e atualizando os clientes')

    all_matches = Db.get_hampionship_game() 
    
    for matches in all_matches:

        check_infomations(matches)  


    print('Finalizado')


def check_infomations(matches):
    
    for match in matches.get('matches'):

        link = match.get('link_odds')
        bashCommand = "/home/diego/Documentos/Projetos/Ghost/SpeedBet07/scripts/save_page_as.sh \""+link+"\" --browser \"firefox\" --destination \"/tmp/bet/bet.html\" --load-wait-time 5"
        print(bashCommand)
        
        os.system("rm -rf /tmp/bet/*")
        os.system(bashCommand)
    
        all_odds = Odds.start(match) 
        match['all_odds'] = all_odds

    Db.update_game_odds(matches.get('key'), matches.get('matches'))

   
   

print('Inicializando verificação das odds')                               
start()
