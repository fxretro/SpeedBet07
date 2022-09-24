# SpeedBet07


O Sistmea SpeedBet07 é composto de um aplicativo e vários scripts que fazem o scrape, ou seja, pegam as informações 
utilizadas de um site na internet.


## Pegando os dados dos jogos de hoje

Esse script serve para pegar todos os jogos do dia atual




## Scripts

1. refresh_odds.sh  - Pega todas as odds de um determinado jogo
2. refresh_bets.sh      - Confere todos os resultados dos jogos e valida as apostas
3. refresh_results.sh   - Atualiza os resultados dos jogos
4. refresh_scrapping.sh - Atualiza as informações dos jogos do dia de hoje

### Caso queira trocar a data do resultado:

Todos os scripts quando vao salvar ou pegar os dados, utilizam o dia de hoje. Você pode querer pegar os dados de outro dia, para isso,
basta alterar o path no arquivo database.py. Exemplo:


1. Altere a data no script do banco de dados para   path = "championship_matches/19092022/", trocando a ultima parte pela data no formato DDMMYYYY
3. Depois, rode o script 
4. Altere a data modificada anteriormente no database para como estava anteriormente






## Contatos

Telegram [[https://t.me/+lXFTyWd85ro3ZGNh]]
WhatsApp (61) 98301-3768