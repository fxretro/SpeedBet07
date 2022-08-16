
import pyautogui
import subprocess
import time
from PIL import ImageColor

color = ImageColor.getcolor('#FF8800', "RGB")

def search_text(text):
    pyautogui.hotkey('ctrl', 'f')
    write_text(text)

def write_text(text):
    pyautogui.write(text, interval=0.05)
    pyautogui.press('enter')


def click_mouse(x, y):
    pyautogui.click(x, y) 

def get_position_mouse():
    return pyautogui.position()

def scroll_down_mouse(x, y):
    pyautogui.moveTo(x, y) 


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
        

def main():
    
   subprocess.call([r'firefox', '-new-tab', "https://www.bet365.com/#/MB/"])
   time.sleep(10)
   
   try:


       click_selected_text(color, 'Apostas Pendentes', 2)
       time.sleep(1)

       click_selected_text(color, 'Ultimas 24 horas', 2)
       time.sleep(1)

       click_selected_text(color, 'Mostrar Historico', 2)
       time.sleep(1)

       click_selected_text(color, '09/08/2022 21:25:46', 2)        


       x, y = get_position_mouse()
       yy = y + 125

       click_mouse(x, yy)


       time.sleep(3)

       pyautogui.screenshot('my_screenshot.png', region=(0,0, 500, 800))              
       print('Parece que encontramos o jogo solicitado...')       
       

   except:
       print('Parece que não encontramos resultados...')
       exit(1)




    
    

main()