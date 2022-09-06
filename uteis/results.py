from logging import exception
from bs4 import BeautifulSoup
import database as Db

def start():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")      

        for all_bets in soup.find_all(class_='sportName soccer'):                                                              
            print(parse(all_bets))




def parse(all_bets):     

    matches = []
    
    for match in all_bets.find_all(class_="event__match"):        

        try:
            stage      = match.find_all(class_="event__stage")[0].getText()
            team_home  = match.find_all(class_="event__participant event__participant--home")[0].getText()
            team_away  = match.find_all(class_="event__participant event__participant--away")[0].getText()            
            score_home = match.find_all(class_="event__score event__score--home")[0].getText()
            score_away = match.find_all(class_="event__score event__score--away")[0].getText()
            
            if stage == 'Encerrado':
                print({'team_home': team_home, 'team_away': team_away, 'score_home': score_home, 'score_away': score_away})  
            
        except:
            pass

    return matches
            
                                             
start()
