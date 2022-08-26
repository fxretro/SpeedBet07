from logging import exception
from bs4 import BeautifulSoup




def start():

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")            

        for all_bets in soup.find_all(class_='ovm-CompetitionList'):                    
            parse(all_bets)



def parse(all_bets):            

    for bet in all_bets:        

        #print(bet)        

        esoccer = bet.find_all(class_="ovm-FavouritesContainer_Favourite")        
        soccer =  bet.find_all(class_="ovm-Competition-open")                

        try:
            #parse_competitions_esoccer(esoccer)            
            
            parse_competitions_soccer(soccer)
        except:            
            pass



def parse_competitions_esoccer(competitions):    

    for competition in competitions:        
                
        competition_name = competition.find(class_="ovm-CompetitionHeader_NameText").getText()                        
        matches = competition.find_all(class_="ovm-FixtureList")                   

        parse_matches(competition_name, matches)


def parse_matches(competition_name, matches):

    print('-------------')            
    print('Competição Esoccer: ', competition_name)   
    print('-------------')

    for match in matches:        

        match_players = match.find_all(class_="ovm-FixtureDetailsTwoWay_TeamsAndScoresInner")
        match_additional = match.find_all(class_="ovm-FixtureDetailsTwoWay_AdditionalInfoWrapper")
        match_score = match.find_all(class_="ovm-FixtureDetailsTwoWay_ScoresWrapper")

        team_one = match_players[0].find_all(class_="ovm-FixtureDetailsTwoWay_TeamName")[0].getText()
        team_two = match_players[0].find_all(class_="ovm-FixtureDetailsTwoWay_TeamName")[1].getText()

        time_now = match_additional[0].find_all(class_="ovm-FixtureDetailsTwoWay_Timer")[0].getText()

        score_one = match_score[0].find_all(class_="ovm-StandardScoresSoccer_StatsPointsWrapper")[0].find(class_="ovm-StandardScoresSoccer_TeamOne").getText()
        score_two = match_score[0].find_all(class_="ovm-StandardScoresSoccer_StatsPointsWrapper")[0].find(class_="ovm-StandardScoresSoccer_TeamTwo").getText()        

        print('Tempo:  ', time_now)
        print('Time 1: ', team_one)
        print('Time 2: ', team_two)
        
        print('Resultado 1:', score_one)
        print('Resultado 2:', score_two)




def parse_competitions_soccer(competitions):    

    print('-------------')  

    for competition in competitions:        
                
        #print(competition)  

        competition_name = competition.find(class_="ovm-CompetitionHeader_NameText").getText() 
        print('competition_name: ', competition_name)





start()