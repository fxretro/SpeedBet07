
cd E:\Ghost\Ghost-Bet-compiler
pyinstaller --windowed --clean --onefile bot.py --add-data="uteis/*;." -c
copy dist/bot.exe C:\Users\ghostbet\Desktop\GhostBet\
start C:\Users\ghostbet\Desktop\GhostBet\bot.exe
