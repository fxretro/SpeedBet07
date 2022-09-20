
import pyautogui
import subprocess
import time
import uteis.database as Db
from PIL import ImageColor
import uteis.helper as Helper

color = ImageColor.getcolor('#FF8800', "RGB")

###########################################################
# Visual tools
###########################################################


def start_browser(url):
    subprocess.call([r'firefox', '-new-tab', url])
    

def click_selected_text(color, text, total_clicks = 2):           
  
    search_text(text)
    time.sleep(1)

    i = 0

    s = pyautogui.screenshot()

    for x in range(s.width):


      for y in range(s.height):        

         if s.getpixel((x, y)) == color and i < total_clicks:
               i = i+1
               click_mouse(x, y) 
               time.sleep(0.5)   
        


def search_text(text):
    pyautogui.hotkey('ctrl', 'f')
    write_text(text)

def write_text(text):
    pyautogui.write(text, interval=0.05)
    pyautogui.press('enter')

def get_position_mouse():
    return pyautogui.position()

def scroll_down_mouse(x, y):
    pyautogui.moveTo(x, y) 


def click_mouse(x, y):
    pyautogui.click(x, y) 

def close_browser_tab():
    pyautogui.hotkey('ctrl', 'w')


def click_focused():

    x, y = get_position_mouse()
    click_mouse(x, y)


def check_login(system_config):
            
   try:
       pyautogui.locateCenterOnScreen(system_config['default']['file_logout'])       
       return False

   except:
       return True


def check_result_search(system_config):
            
   try:
       pyautogui.locateCenterOnScreen(system_config['default']['file_no_results'])       
       return False

   except:
       return True


def check_focus(system_config):
            
   try:
       pyautogui.locateCenterOnScreen(system_config['default']['file_logo'])       
       return True

   except:
       return False




###########################################################
# Browser Bot - Futebol virtual
###########################################################


def bot_futebol_virtual_ambos(system_config, configs, text, url, key):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))
   check_focus(system_config)


   if check_login(system_config):    
        bot_futebol_virtual_ambos_continue(system_config, configs, text, key)

   else:
        Helper.log('Favor realizar o login para ' + key, colour='red')
        close_browser_tab()   



def bot_futebol_virtual_ambos_continue(system_config, configs, text, key):

   time.sleep(configs.get("delay"))
   check_focus(system_config)

   Helper.log("Iniciando investimento", key=key, type=1)
   search_text("Futebol")      

   time.sleep(configs.get("delay")) 
   
   click_selected_text(color, text[0], 1)     
   time.sleep(configs.get("delay")) 

   check_focus(system_config)

   bet = text[2]
   bot_futebol_virtual_ambos_finish(system_config, configs, key, text[1], text[0], bet)

   Helper.log("Finalizado", key=key, type=1)
   close_browser_tab()   
   

    
def bot_futebol_virtual_ambos_finish(system_config, configs, key, match, league, bet):

    Helper.log("Clicando em " + match, key=key, type=1)

    click_selected_text(color, match, 1)         

    time.sleep(configs.get("delay")) 

    search_text("Para o Time Marcar - Sim/Nao")       
    click_selected_text(color, "Sim", 2)     

    x, y = get_position_mouse()
    yy = y + configs.get("move_down_bet") + 50   

    scroll_down_mouse(x, yy)      
    click_mouse(x, yy)
    Helper.log("Realizando investimento em " + match, key=key, type=1)        

    configs = Helper.get_configs(system_config['default']['uid'])
    
    if configs.get('stopped') == 0:        
        bot_futebol_virtual_ambos_salva(configs, key, bet)

    else:
        Helper.log('Robo em modo stop efetuado pelo administrador', colour='red')
        time.sleep(configs.get("delay_fifa_end")) 
        


def bot_futebol_virtual_ambos_salva(configs,  key, bet):

    click_selected_text(color, 'Valor de Aposta')

    final_value = int(bet)
    write_text(str(final_value))  
    Helper.log("Adicionando valor do investimento", key=key, type=1)  
    
    save_evidences()
    
    x, y = get_position_mouse()
    click_mouse(x, y)
    click_mouse(x + configs.get("move_right_bet"), y)      
    pyautogui.press('enter')
                                                            
    time.sleep(configs.get("delay"))                                
    click_selected_text(color, 'Terminar', 2)       
                                                                            

           
def save_evidences():

   Helper.log('Realizando printscreen da bet')
   #pyautogui.screenshot('bets/bet_'+key+'.png')


   


   
