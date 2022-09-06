from bs4 import BeautifulSoup
import database as Db


def start():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")                       

        for all_bets in soup.find_all(class_='eventlistContainer'):                                
            parse(all_bets)    



def parse(all_bets):     
    
    for match in all_bets:        

        championships = match.find_all(class_="pais")

        for championship in championships:

            name         = championship.find_all(class_="eventlist-country")[0].find(class_="name").getText()                
            matches      = []

            for match in championship.find(class_="eventlist-events").find_all(class_="containerCards"):
                
                data         = match.find_all(class_="dateAndHour")[0].find(class_="date").getText()
                hora         = match.find_all(class_="dateAndHour")[0].find(class_="hour").getText()
                time_a       = match.find_all(class_="nameTeam")[0].getText()
                time_b       = match.find_all(class_="nameTeam")[1].getText()
                odd_casa     = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[0].getText()
                odd_empate   = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[1].getText()
                odd_fora     = match.find_all(class_="outcomesMain")[0].find_all(class_="odd")[2].getText()              

                matches.append({'data': data, 'hora': hora, 'time_a': time_a, 'time_b': time_b, 'odd_casa': odd_casa, 'odd_empate': odd_empate, 'odd_fora': odd_fora, 'status': 'Aguardando'})


            Db.add_championship_game(name, matches)        
                                             
start()
