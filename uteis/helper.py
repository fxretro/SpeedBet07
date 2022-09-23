import six
import threading
import uteis.database as Db
from datetime import datetime
from datetime import timedelta

from logging import exception
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


def get_tokens():

    log('Verificando tokens ')

    try:
        tokens = Db.get_tokens()
        return tokens

    except exception as e:
        log("Não foi possível pegar os tokens")
        print(e)
        pass
        

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
            six.print_(colored('['+ datetime.now().strftime("%d.%b %Y %H:%M:%S") + '] - ' + text, colour))
        else:
            six.print_(colored(figlet_format(
                '['+ datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text, font=font), colour))
    else:
        six.print_('['+ datetime.now().strftime("%d.%b %Y %H:%M:%S") + ']' + text)

