
import pyautogui
import subprocess
import time
from PIL import ImageColor


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

def bot_escanteio_asiatico(configs, key, text, url):
         
   start_browser(url)
   time.sleep(configs.get("delay_start"))

   try:
       x, y = pyautogui.locateCenterOnScreen(configs.get("file_logo"))
       pyautogui.click(x, y)

   except:
       print('Não conseguimos clicar no verde', colour='red')

   
   search_text("Futebol")   
   click_selected_text(color, " v ")
      
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Odds Asiaticas')
      
   time.sleep(configs.get("delay"))
   click_selected_text(color, 'Gols +')
   click_selected_text(color, 'Escanteios Asiaticos')

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
   
   x, y = get_position_mouse()
   click_mouse(x, y)
   click_mouse(x + configs.get("move_right_bet") + 100, y)      

   time.sleep(configs.get("delay_end"))
   close_browser_tab()   
   
