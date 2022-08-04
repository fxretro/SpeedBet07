import six
import uteis.database as Db
import datetime
from playwright.sync_api import sync_playwright

from logging import exception
from uteis.widget import *
from pyfiglet import  figlet_format
from PIL import ImageColor

try:
    from termcolor import colored
except ImportError:
    colored = None
    

color = ImageColor.getcolor('#FF8800', "RGB")


###########################################################
# Auxiliares 
###########################################################

def get_configs(uid):

    log('Verificando configurações do usuário ' + uid)

    try:
        configs = Db.get_configurations(uid)[0]
        return configs

    except exception as e:
        log("Sua aplicação ainda não foi configurada!")
        exit(1)
    

def show_configs(config):

    log('App Id: '+ str(config.get("api_id")))
    log('App Hash: ' + str(config.get("api_hash")))
    log('Delay: '+ str(config.get("delay")))
    log('Delay Start: ' + str(config.get("delay_start")))
    log('Delay End: ' + str(config.get("delay_end")))
    log('Bet Value: ' + str(config.get("bet")))
    log('Move down bet: ' + str(config.get("move_down_bet")))
    log('Move right bet: ' + str(config.get("move_right_bet")))
    

def log(text, colour = 'green', font='slant', figlet=False, key='0', type=0):

    if key != '0':

        if type == 0:
            Db.update_url_master(key, text)
        else:
            Db.update_url_master_tsv(key, text)
    
    if colored:
        if not figlet:
            six.print_(colored('['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] - ' + text, colour))
        else:
            six.print_(colored(figlet_format(
                '['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text, font=font), colour))
    else:
        six.print_('['+ datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text)



###########################################################
# Auxiliares 
###########################################################



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
    

