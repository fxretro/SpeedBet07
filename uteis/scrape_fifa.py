from logging import exception
from bs4 import BeautifulSoup
import database as Db


def start():

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")            

        for all_bets in soup.find_all(class_='ovm-Competition'):                    
            parse(all_bets)



def parse(all_bets):                

    

    for bet in all_bets:                         

        #print(bet)

        headerr_ = bet.find_all(class_="ovm-CompetitionHeader_NameText")
        matches = bet.find_all(class_="ovm-Fixture_Container")
        
                
        for championship in headerr_:            
            Db.add_championship(championship.getText())

        for match in matches:            

            #print(match)            
            
            try:
                timerr = match.find_all(class_="ovm-InPlayTimer")[0].getText()     
                event_count = match.find_all(class_="ovm-FixtureEventCount")[0].getText()     

                team_a = match.find_all(class_="ovm-FixtureDetailsTwoWay_TeamName")[0].getText()
                team_b = match.find_all(class_="ovm-FixtureDetailsTwoWay_TeamName")[1].getText()

                team_a_score = match.find_all(class_="ovm-StandardScoresSoccer_TeamOne")[0].getText()
                team_b_score = match.find_all(class_="ovm-StandardScoresSoccer_TeamTwo")[0].getText()                

                odds_a = match.find(class_="ovm-MarketGroup").find(class_="ovm-HorizontalMarket_Participants").find_all(class_="ovm-ParticipantOddsOnly_Odds")[0].getText()
                odds_b = match.find(class_="ovm-MarketGroup").find(class_="ovm-HorizontalMarket_Participants").find_all(class_="ovm-ParticipantOddsOnly_Odds")[1].getText()
                odds_c = match.find(class_="ovm-MarketGroup").find(class_="ovm-HorizontalMarket_Participants").find_all(class_="ovm-ParticipantOddsOnly_Odds")[2].getText()
                                
                print('Campeonato: ', championship.getText(), ' - Jogo: ', timerr, team_a, team_a_score, ' x ' ,team_b_score, team_b, 'Total de eventos: ', event_count, 'Odd casa: ', odds_a, 'Odd empate: ', odds_b, 'Odd visitante: ', odds_c)                                        
                                                
                                                
                Db.add_championship_game(championship.getText(), timerr, team_a, team_b, team_a_score, team_b_score, odds_a, odds_b, odds_c, event_count)

            except:
                pass
                


start()