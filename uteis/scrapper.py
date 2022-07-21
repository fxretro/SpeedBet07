from playwright.sync_api import sync_playwright


def scraping_live_now(url):

    
    with sync_playwright() as p:
        
        browser = p.firefox.launch(headless=False)
        
        page = browser.new_page()
        page.goto(url)                     

        return nameCapetition(page)
                

def nameCapetition(page):

    listCurTime   = page.locator('div.ovm-FixtureDetailsTwoWay_Timer').all_text_contents()
    listTeam = page.locator('.ovm-FixtureDetailsTwoWay_Team > div:nth-child(1)').all_text_contents()
    listScoreOne = page.locator('div.ovm-StandardScoresSoccer_TeamOne').all_text_contents()
    listScoreTwo = page.locator('div.ovm-StandardScoresSoccer_TeamTwo').all_text_contents()

    listOddsOne = page.locator('div.ovm-MarketGroup > div > div > div:nth-child(1)').all_text_contents()
    listOddsTwo = page.locator('div.ovm-MarketGroup > div > div > div:nth-child(2)').all_text_contents()
    
    return listTeam, listCurTime, listScoreOne, listScoreTwo, listOddsOne, listOddsTwo
    

