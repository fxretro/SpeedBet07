from bs4 import BeautifulSoup
import database as Db


###########################################################
# Campeonatos com Link direto
###########################################################


def start():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")                

        championship = soup.find(class_="eventlist-country").find(class_="name").getText()        
        print('Inicializando scrape próximos jogos do campeonato ', championship)

        for all_bets in soup.find_all(class_='containerCards'):                                
            parse(championship, all_bets)    



def parse(championship, all_bets):     
    
    for match in all_bets:

        data       = match.find_all(class_="dateAndHour")[0].find(class_="date").getText()
        hora       = match.find_all(class_="dateAndHour")[0].find(class_="hour").getText()
        time_a     = match.find_all(class_="nameTeam")[0].getText()
        time_b     = match.find_all(class_="nameTeam")[1].getText()
        odd_casa   = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[0].getText()
        odd_empate = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[1].getText()
        odd_fora   = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[2].getText()              

        Db.add_championship_game(championship, data, hora, time_a, time_b, odd_casa, odd_empate, odd_fora)        


###########################################################
# Jogos hoje
###########################################################


def start_today():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")                

        championship = soup.find_all(class_="eventlist-country").find(class_="name").getText()        
        print('Inicializando scrape próximos jogos do campeonato ', championship)

        for all_bets in soup.find_all(class_='containerCards'):                                
            parse_today(championship, all_bets)    



def parse_today(championship, all_bets):     
    
    for match in all_bets:

        data       = match.find_all(class_="dateAndHour")[0].find(class_="date").getText()
        hora       = match.find_all(class_="dateAndHour")[0].find(class_="hour").getText()
        time_a     = match.find_all(class_="nameTeam")[0].getText()
        time_b     = match.find_all(class_="nameTeam")[1].getText()
        odd_casa   = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[0].getText()
        odd_empate = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[1].getText()
        odd_fora   = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[2].getText()              

        Db.add_championship_game(championship, data, hora, time_a, time_b, odd_casa, odd_empate, odd_fora)      

                                              
#start()
start_today()