from logging import exception
import moment
import database as Db
import subprocess

def start():    

    print('Vericando bets e atualizando os clientes')

    all_matches = Db.get_hampionship_game() 
    
    for matches in all_matches:
        check_infomations(matches)  

    print('Finalizado')


def check_infomations(matches):

    key = matches.get('key')
    bashCommand = "cwm --rdf test.rdf --ntriples > test.nt"


    for match in matches.get('matches'):

        link = match.get('link_odds')
        time_a = match.get('time_a')
        time_b = match.get('time_b')


        print('Verificando: ', key, time_a, time_b, link)
    
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        
            
   


print('Inicializando verificação dos resultados nas apostas')                               
start()
