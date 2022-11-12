# SpeedBet07


O sistema SpeedBet07 é composto de um aplicativo e vários scripts que fazem o scrape, ou seja, pegam as informações dos jogos de futebol
utilizadas de um site na internet. Considero esse um negócio sem riscos, porque você vai apenas refazer a aposta na casa de apostas principal.

Como funciona? Você pode ter a sua plataforma de apostas esportivas de forma rápida e sem riscos. 

1. O sistema pega todos os jogos e as odds.
2. A odd sempre vai ser menor que nas casas de apostas conhecidas, como bet e betano
3. O seu cliente vai fazer a aposta usando o app, o cambista vai validar a aposta e fazer no site da casa principal (bet por exemplo)
4. Se a aposta der green, você pega o valor da odd da casa principal e subtrai do valor da odd do app. Esse valor é o lucro da pessoa dona do sistema. O restante repassa para o cliente.
5. Caso aconteça o red, o sistema avisa o cliente.



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
Youtube [[https://www.youtube.com/playlist?list=PL3CNm1uwGm_BLmbkOnvhkp1AVKfndx7wz]]
