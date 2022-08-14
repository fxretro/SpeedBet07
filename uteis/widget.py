
from re import search
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
# Browser Bot - Escanteios asiáticos
###########################################################



def bot_escanteio_asiatico(system_config, configs, url, key):
         
   start_browser(url)
   
   time.sleep(configs.get("delay_start"))

   if check_result_search(system_config):

        Helper.log('Parece que não encontramos o jogo solicitado...', colour='red')
        close_browser_tab()   

   else:
        bot_escanteio_asiatico_continue(system_config, configs, key)

   

def bot_escanteio_asiatico_continue(system_config, configs, key):

   info = Db.get_urls_key(key)[0]
   status = info.get("status")   
   bet = info.get("bet")   
   
   time.sleep(configs.get("delay"))
   check_focus(system_config)
      
   Helper.log("Iniciando investimento", key=key)
   search_text("Futebol")   
   click_selected_text(color, " v ")
      
   time.sleep(configs.get("delay"))
   Helper.log("Clicando em Odds Asiaticas", key=key)
   click_selected_text(color, 'Odds Asiaticas')
      
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Gols +/-')
   click_selected_text(color, 'Escanteios Asiaticos')
   Helper.log("Clicando em Escanteios Asiaticos", key=key)

   time.sleep(configs.get("delay"))
   x, y = get_position_mouse()
   yy = y + configs.get("move_down_bet")
   xx = x + configs.get("move_right_bet")
   scroll_down_mouse(xx, yy+25)
   time.sleep(configs.get("delay")) 

   click_mouse(xx, yy)
      
   
   if status == 'Anulado':
        Helper.log("Investimento anulado pelo cliente! ",colour="red", key=key, type=0)
        close_browser_tab()   
        
   else:

    time.sleep(configs.get("delay")) 
    click_selected_text(color, 'Valor de Aposta')
    write_text(str(bet))  
    Helper.log("Adicionando valor do investimento", key=key)     
   
    x, y = get_position_mouse()
    click_mouse(x, y)
    click_mouse(x + configs.get("move_right_bet"), y)      

    time.sleep(configs.get("delay_end"))
    close_browser_tab()   
    Helper.log("Finalizado", key=key)



###########################################################
# Browser Bot - Futebol virtual
###########################################################


def bot_futebol_virtual_ambos(system_config, configs, text, url, key):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))


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
   click_selected_text(color, text[0], 1)            
   time.sleep(configs.get("delay")) 

   matches = [text[1], text[2], text[3], text[4]]   

   for match in matches:
    bot_futebol_virtual_ambos_finish(configs, key, match, text[0])
    time.sleep(configs.get("delay_fifa_end"))     


   time.sleep(configs.get("delay_end"))        
   Helper.log("Finalizado", key=key, type=1)
   close_browser_tab()   
   
    
def bot_futebol_virtual_ambos_finish(configs, key, match, league):

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

    info = Db.get_urls_tsv_key(key)[0]
    status = info.get("status")   
        
    if status == 'Anulado':
        Helper.log("Investimento anulado pelo cliente! ",colour="red", key=key, type=1)                                    
    else:
        bot_futebol_virtual_ambos_salva(configs, info, key, league)
        


def bot_futebol_virtual_ambos_salva(configs, info, key, league):

    bet = info.get("bet_fifa")   
    click_selected_text(color, 'Valor de Aposta')
    write_text(str(bet))  
    Helper.log("Adicionando valor do investimento", key=key, type=1)  
    
    save_evidences()
    
    x, y = get_position_mouse()
    click_mouse(x, y)
    click_mouse(x + configs.get("move_right_bet"), y)      
    pyautogui.press('enter')
            
    Helper.log(Helper.get_msg_next_play(configs), key=key, type=1)       
                                                
    time.sleep(configs.get("delay"))                                
    click_selected_text(color, 'Terminar', 1)       
    time.sleep(configs.get("delay"))    

    click_selected_text(color, Helper.get_diff_league(league), 1)     
    time.sleep(configs.get("delay"))    
    click_selected_text(color, league, 1)                                                                                 

           
def save_evidences():

   Helper.log('Realizando printscreen da bet')
   #pyautogui.screenshot('bets/bet_'+key+'.png')


   

###########################################################
# Browser Bot - Gol Odd 1.3
###########################################################


def bot_futebol_virtual_gol(system_config, configs, championship, url):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))

   if check_login(system_config):    
        bot_futebol_virtual_gol_continue(system_config, configs, championship, '0')

   else:
        Helper.log('Favor realizar o login', colour='red')
        close_browser_tab()   



def bot_futebol_virtual_gol_continue(system_config, configs, championship, key):

   time.sleep(configs.get("delay"))
   check_focus(system_config)

   Helper.log("Iniciando investimento", key=key, type=1)
   search_text("Futebol")      
   click_selected_text(color, championship, 1)            
   time.sleep(configs.get("delay"))    

   bot_futebol_virtual_gol_finish(configs, championship)

   
    
def bot_futebol_virtual_gol_finish(configs, league):

    Helper.log("Clicando em " + league, type=1)    

    click_selected_text(color, "Fulltime Result", 2)
    time.sleep(configs.get("delay"))  

    x, y = get_position_mouse()
    click_mouse(x, y)
    click_mouse(x + configs.get("move_right_bet"), y + 50)      
    time.sleep(configs.get("delay"))  

    
    search_text("Gols Mais/Menos")       
    click_selected_text(color, "Total de Gols Exatos", 2)         
    search_text("1.36")    

    time.sleep(configs.get("delay"))  
    x, y = get_position_mouse()
    click_mouse(x, y)
    
    time.sleep(configs.get("delay"))        
        
    Helper.log("Realizando investimento em " + league, type=1)        
    
    bet = configs.get("bet_fifa")   
    click_selected_text(color, 'Valor de Aposta')
    write_text(str(bet))  
    Helper.log("Adicionando valor do investimento", type=1)  
    
    save_evidences()
    
    x, y = get_position_mouse()
    click_mouse(x, y)
    click_mouse(x + configs.get("move_right_bet"), y)      
    pyautogui.press('enter')
                                                            
    time.sleep(configs.get("delay"))                                
    click_selected_text(color, 'Terminar', 1)         

    Helper.log("Finalizado", type=1)
    close_browser_tab()     
    


   
