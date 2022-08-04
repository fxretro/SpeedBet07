
import pyautogui
import subprocess
import time
import uteis.database as Db
from PIL import ImageColor
from uteis.helper import *



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




###########################################################
# Browser Bot - Escanteios asiáticos
###########################################################

def bot_escanteio_asiatico(configs, url, key):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))
   
   try:
       x, y = pyautogui.locateCenterOnScreen(configs.get("file_logo"))
       pyautogui.click(x, y)

   except:
       print('Não conseguimos clicar no verde')

   
   log("Iniciando investimento", key=key)
   search_text("Futebol")   
   click_selected_text(color, " v ")
      
   time.sleep(configs.get("delay"))
   log("Clicando em Odds Asiaticas", key=key)
   click_selected_text(color, 'Odds Asiaticas')
      
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Gols +')
   click_selected_text(color, 'Escanteios Asiaticos')
   log("Clicando em Escanteios Asiaticos", key=key)

   time.sleep(configs.get("delay"))
   x, y = get_position_mouse()
   yy = y + configs.get("move_down_bet")
   xx = x + configs.get("move_right_bet")
   scroll_down_mouse(xx, yy)
   time.sleep(configs.get("delay")) 
      
   time.sleep(configs.get("delay")) 
   click_mouse(xx, yy)
      
   click_selected_text(color, 'Valor de Aposta')
   write_text(str(configs.get("bet")))  
   log("Adicionando valor do investimento", key=key)  

   status = Db.get_urls_key(key)
   print(status)
   
   x, y = get_position_mouse()
   click_mouse(x, y)
   click_mouse(x + configs.get("move_right_bet") + 100, y)      

   time.sleep(configs.get("delay_end"))
   close_browser_tab()   
   log("Finalizado", key=key)
   

###########################################################
# Browser Bot - Futebol virtual
###########################################################


def bot_futebol_virtual_ambos(configs, text, url, key):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))

   try:
       x, y = pyautogui.locateCenterOnScreen(configs.get("file_logo"))
       pyautogui.click(x, y)

   except:
       print('Não conseguimos clicar no verde')


   log("Iniciando investimento", key=key, type=1)
   search_text("Futebol")      
   click_selected_text(color, text[0], 1)            
   time.sleep(1)

   log("Clicando em " + text[1], key=key, type=1)
   click_selected_text(color, "20:01", 1)     
   search_text("Para o Time Marcar - Sim/Nao")   
   
   click_selected_text(color, "Sim",2)     

   x, y = get_position_mouse()
   yy = y+100       

   scroll_down_mouse(x, yy)      
   click_mouse(x, yy)
   log("Realizando investimento em " + text[1], key=key, type=1)

   status = Db.get_urls_tsv_key(key)
   print('Status: ', status.get("status"))

   click_selected_text(color, 'Valor de Aposta')
   write_text(str(configs.get("bet")))  
   log("Adicionando valor do investimento", key=key, type=1)  
   
   x, y = get_position_mouse()
   click_mouse(x, y)
   click_mouse(x + configs.get("move_right_bet") + 100, y)      

   time.sleep(configs.get("delay_end"))
   close_browser_tab()   
   log("Finalizado", key=key, type=1)

   




   
