from bs4 import BeautifulSoup


def start(match):    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml") 

        odds_info = []                      

        for all_bets in soup.find_all(class_='eventdetail-market'):                                
            odds_info.append(parse(all_bets, match))


        return odds_info



def parse(all_bets, match):     

    odds_info = []
    
    for match in all_bets:        

        market_name_all = match.find_all(id="nomeMercado")
        markets = match.find_all(class_="eventdetail-optionItem")

        try:
            market_name = market_name_all[0].getText()
        except :
            pass


        for market in markets:

            name = market.find_all(class_='name')[0].getText()
            odd  = market.find_all(class_='odd')[0].getText() 
            odds_info.append({'market_name': market_name, 'name': name, 'odd': odd})


    return odds_info



