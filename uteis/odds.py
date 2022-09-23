from bs4 import BeautifulSoup
import database as Db


def start():    

    with open("/tmp/bet/bet.html") as fp:
        soup = BeautifulSoup(fp, "lxml")                       

        for all_bets in soup.find_all(class_='eventdetail-market'):                                
            parse(all_bets)    



def parse(all_bets):     
    
    for match in all_bets:        

        market_name = match.find_all(id="nomeMercado")
        markets = match.find_all(class_="eventdetail-optionItem")

        try:
            market_name = market_name[0].getText()
            print('Nome do mercado: ', market_name)

        except:
            pass


        for market in markets:

            name = market.find_all(class_='name')[0].getText()
            odd  = market.find_all(class_='odd')[0].getText() 

            print(name, odd)
            


       


                

print('Inicializando Scrape dos jogos do dia')                                                                            
start()
