from logging import exception
from bs4 import BeautifulSoup




def start():

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")            

        for all_bets in soup.find_all(class_='ovm-Competition-open'):                    
            parse(all_bets)



def parse(all_bets):            

    for bet in all_bets:        

        competitions = bet.find(class_="ovm-Fixture_Container")                        

        try:
            parse_competitions(competitions)            

        except:            
            pass


def parse_competitions(competitions):    

    for competition in competitions:        

        print(',,,,,,,,,,,,,')    
        print('Completo: ', competition)   

        print('-------------')    
        print('Competição: ', competition.find(class_="ovm-FixtureDetailsTwoWay_TeamsAndScoresInner"))   



start()