from logging import exception
from bs4 import BeautifulSoup
import database as Db
import re

def keep_names_simple(name):
    return re.sub("[\(\[].*?[\)\]]", "", name)


def start():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")   

        all_matches = Db.get_hampionship_game() 
        results = []

        for all_bets in soup.find_all(class_='sportName soccer'):                                                              
            results.append(parse(all_bets))


        compare(all_matches, results)



def parse(all_bets):     

    all_matches = []
    
    for match in all_bets.find_all(class_="event__match"):        

        try:
            
            stage      = match.find_all(class_="event__stage")[0].getText()
            team_home  = match.find_all(class_="event__participant--home")[0].getText()
            team_away  = match.find_all(class_="event__participant--away")[0].getText()            
            score_home = match.find_all(class_="event__score event__score--home")[0].getText()
            score_away = match.find_all(class_="event__score event__score--away")[0].getText()
            
            all_matches.append({'stage': stage, 'team_home': team_home, 'team_away': team_away, 'score_home': score_home, 'score_away': score_away})  
            
        except:
            pass

    return all_matches


def compare(all_matches, results): 


    for matches in all_matches:

        matches_tmp = []

        for match in matches.get('matches'):

                new_matches = check_results(match, results)                
                matches_tmp.append(new_matches)

        matches['match_tmp'] = matches_tmp        

            

    reorder_infomations(all_matches)


def check_results(match, results):

    time_a = keep_names_simple(match.get('time_a'))
    time_b = keep_names_simple(match.get('time_b'))

    for result in results:        

        for match_result in result:

            team_home = keep_names_simple(match_result.get('team_home'))
            team_away = keep_names_simple(match_result.get('team_away'))

            score_home = match_result.get('score_home')
            score_away = match_result.get('score_away')
            stage      = match_result.get('stage')
            
            condition_1 = time_a    in team_home
            condition_2 = team_home in time_a            
            condition_3 = time_b    in team_away
            condition_4 = team_away in time_b
                                       
            if condition_1 or condition_2 or condition_3 or condition_4:

                match['score_home'] = score_home
                match['score_away'] = score_away
                match['stage'] = stage
            

    return match   



def reorder_infomations(all_matches):

    
    for match in all_matches:        
        Db.update_championship_game(match.get('key'), match.get('match_tmp'))
   


print('Conferindo resultado dos jogos do dia de hoje')                                                                        
start()
