
import pyautogui
import subprocess
import time


def start_browser(url):
    subprocess.call([r'firefox', '-new-tab', url])


def click_selected_text(delay, color, text, url):   
   start_browser(url)
   time.sleep(delay)

   pyautogui.hotkey('ctrl', 'f')
   pyautogui.write(text, interval=0.05)
   pyautogui.press('enter')
   time.sleep(delay)

   i = 0

   s = pyautogui.screenshot()
   for x in range(s.width):
      for y in range(s.height):

         if s.getpixel((x, y)) == color and i < 5:
               pyautogui.click(x, y) 
               i = i+1
