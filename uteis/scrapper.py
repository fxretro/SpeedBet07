from playwright.sync_api import sync_playwright
import time

###########################################################
# Scrapper Soccer live 
###########################################################

def scraping_live_now(url):

    
    with sync_playwright() as p:
        
        browser = p.firefox.launch(headless=False)
        
        page = browser.new_page()
        page.goto(url)                     

        return scrape_teams_info(page)
                

def scrape_teams_info(page):

    listCurTime   = page.locator('div.ovm-FixtureDetailsTwoWay_Timer').all_text_contents()
    listTeam = page.locator('.ovm-FixtureDetailsTwoWay_Team > div:nth-child(1)').all_text_contents()
    listScoreOne = page.locator('div.ovm-StandardScoresSoccer_TeamOne').all_text_contents()
    listScoreTwo = page.locator('div.ovm-StandardScoresSoccer_TeamTwo').all_text_contents()

    listOddsOne = page.locator('div.ovm-MarketGroup > div > div > div:nth-child(1)').all_text_contents()
    listOddsTwo = page.locator('div.ovm-MarketGroup > div > div > div:nth-child(2)').all_text_contents()
    
    return listTeam, listCurTime, listScoreOne, listScoreTwo, listOddsOne, listOddsTwo


###########################################################
# Scrapper Soccer match 
###########################################################


def scraping_live_team(url, team):

    print('Procurando por ', team)
    
    with sync_playwright() as p:
        
        browser = p.firefox.launch(headless=False)        
        page = browser.new_page()
        page.goto(url)        
        page.wait_for_url(url)             

        time.sleep(15)

        #page.locator('div.ipe-GridHeaderTabLink:nth-child(5) > div:nth-child(1)').click()
        

    

def click_team(str):
    print(str)
