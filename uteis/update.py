from logging import exception
import moment
import database as Db
import re

def keep_names_simple(name):
    return re.sub("[\(\[].*?[\)\]]", "", name)


def start():    

    print('Vericando bets e atualizando os clientes')

    all_matches = Db.get_hampionship_game() 
    bets = Db.get_bets()

    reorder_infomations(all_matches, bets)


def reorder_infomations(all_matches, bets):

    for bet in bets:

        for matches in bet.get('match'):

            match_info = search_match_results(matches, all_matches)
            
            matches_old = matches   
            matches = match_info       

        Db.update_bets(bet.get('key'), bet.get('match'), matches_old)


def search_match_results(matches, all_matches):

    time_a = keep_names_simple(matches.get('time_a'))
    time_b = keep_names_simple(matches.get('time_b'))

    for match_result in all_matches:

        for match_check in match_result.get('match_results'):

            team_home = keep_names_simple(match_check.get('time_a'))
            team_away = keep_names_simple(match_check.get('time_b'))           

            condition_1 = time_a    in team_home
            condition_2 = team_home in time_a            
            condition_3 = time_b    in team_away
            condition_4 = team_away in time_b

            if condition_1 or condition_2 or condition_3 or condition_4:                      

                score_home = match_check.get('score_home')
                score_away = match_check.get('score_away')
                stage      = match_check.get('stage')

                matches['score_home'] = score_home
                matches['score_away'] = score_away
                matches['stage']      = stage
                matches['bet_win']    = get_status_bet_match(matches)


def get_status_bet_match(match):

    bet_win = 0   

    odd_casa_ativo   = match['odd_casa_ativo']
    odd_empate_ativo = match['odd_empate_ativo']
    odd_fora_ativo   = match['odd_fora_ativo']
  
    score_home = int(match['score_home'])
    score_away = int(match['score_away'])

    if odd_casa_ativo == 1 and score_home > score_away:
        bet_win = 1

    if odd_empate_ativo == 1 and score_home == score_away:
        bet_win = 2

    if odd_fora_ativo == 1 and score_away > score_home:
        bet_win = 3

    return bet_win
    


print('Inicializando verificação dos resultados nas apostas')                               
start()
