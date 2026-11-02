# One-off generator for `lucero.games` and `lucero.crm.juegos` (fases 5-6).
import json
G = {
'es': {'games': {
  'kicker': 'Tu pedido ya está en la cocina', 'title': 'Mientras esperás la comida, podés jugar', 'sub': 'Cuando llegue tu plato te avisamos, aunque estés jugando.',
  'soloTitle': 'Para jugar desde tu celular', 'tableTitle': 'Para jugar con la mesa', 'play': 'Jugar', 'backToOrder': 'Volver a mi pedido',
  'close': 'Cerrar el juego', 'loading': 'Cargando el juego…', 'again': 'Jugar de nuevo', 'backToGames': 'Volver a los juegos',
  'arrived': '¡Llegó tu pedido!', 'seeIt': 'Ver mi mesa',
  'result': {'done': 'Terminaste', 'stopped': 'Partida cortada', 'points': '{n, plural, one {# punto} other {# puntos}}'},
  'items': {'ninja': {'name': 'Ninja', 'tagline': 'Cortá todo lo que vuela. Las bombas, no.'},
            'combinaciones': {'name': 'Combinaciones', 'tagline': 'Juntá tres iguales y armá cadenas.'},
            'catapulta': {'name': 'Catapulta', 'tagline': 'Tres tiros por nivel para tirar la torre.'},
            'dibujo': {'name': 'Dibujá y adiviná', 'tagline': 'Uno dibuja y la mesa adivina.'},
            'hockey': {'name': 'Hockey', 'tagline': 'Uno contra uno, a cinco goles.'}},
  'ruleta': {'title': 'Ruleta de la casa', 'spin': 'Girar la ruleta', 'spinning': 'Girando…', 'won': 'Ganaste: {prize}', 'show': 'Mostrale el código al mozo.',
             'nothing': 'Esta vez no tocó. ¡En el próximo pedido!', 'nothingShort': 'Otra vez', 'note': 'Un tiro por pedido. Premios de ejemplo: cada local elige los suyos.'}},
 'juegos': {'title': 'Juegos y ruleta', 'sub': 'Los premios de la ruleta, sus chances y lo que ganó cada mesa.', 'prizes': 'Premios de la ruleta', 'prizeName': 'Premio',
            'nothing': 'Sin premio («Esta vez no tocó»)', 'weight': 'Peso', 'remove': 'Quitar {prize}', 'newPrize': 'Nuevo premio', 'add': 'Sumar un premio',
            'rule': 'Un tiro por pedido. El porcentaje es la chance de cada premio; las porciones de la ruleta se ven iguales.',
            'handed': 'Premios de esta noche', 'noneYet': 'Todavía nadie ganó nada esta noche.', 'games': 'Juegos que ven tus clientes'}},
'en': {'games': {
  'kicker': 'Your order is in the kitchen', 'title': 'While your food is on its way, you can play', 'sub': 'We’ll let you know when your dish arrives, even mid-game.',
  'soloTitle': 'Play on your phone', 'tableTitle': 'Play with the table', 'play': 'Play', 'backToOrder': 'Back to my order',
  'close': 'Close the game', 'loading': 'Loading the game…', 'again': 'Play again', 'backToGames': 'Back to the games',
  'arrived': 'Your order is here!', 'seeIt': 'See my table',
  'result': {'done': 'Finished', 'stopped': 'Game stopped', 'points': '{n, plural, one {# point} other {# points}}'},
  'items': {'ninja': {'name': 'Ninja', 'tagline': 'Slice everything that flies. Not the bombs.'},
            'combinaciones': {'name': 'Combinaciones', 'tagline': 'Match three and build chains.'},
            'catapulta': {'name': 'Catapult', 'tagline': 'Three shots per level to bring the tower down.'},
            'dibujo': {'name': 'Draw and guess', 'tagline': 'One draws, the table guesses.'},
            'hockey': {'name': 'Hockey', 'tagline': 'One on one, first to five.'}},
  'ruleta': {'title': 'House wheel', 'spin': 'Spin the wheel', 'spinning': 'Spinning…', 'won': 'You won: {prize}', 'show': 'Show the code to the waiter.',
             'nothing': 'No luck this time. Next order!', 'nothingShort': 'Next time', 'note': 'One spin per order. Example prizes: each venue picks its own.'}},
 'juegos': {'title': 'Games and wheel', 'sub': 'The wheel’s prizes, their odds and what each table won.', 'prizes': 'Wheel prizes', 'prizeName': 'Prize',
            'nothing': 'No prize («No luck this time»)', 'weight': 'Weight', 'remove': 'Remove {prize}', 'newPrize': 'New prize', 'add': 'Add a prize',
            'rule': 'One spin per order. The percentage is each prize’s chance; the wheel’s slices look equal.',
            'handed': 'Tonight’s prizes', 'noneYet': 'Nobody has won anything tonight yet.', 'games': 'Games your guests see'}},
'pt': {'games': {
  'kicker': 'Seu pedido já está na cozinha', 'title': 'Enquanto a comida não chega, você pode jogar', 'sub': 'Quando o prato chegar a gente avisa, mesmo no meio do jogo.',
  'soloTitle': 'Para jogar no seu celular', 'tableTitle': 'Para jogar com a mesa', 'play': 'Jogar', 'backToOrder': 'Voltar ao meu pedido',
  'close': 'Fechar o jogo', 'loading': 'Carregando o jogo…', 'again': 'Jogar de novo', 'backToGames': 'Voltar aos jogos',
  'arrived': 'Seu pedido chegou!', 'seeIt': 'Ver minha mesa',
  'result': {'done': 'Terminou', 'stopped': 'Partida interrompida', 'points': '{n, plural, one {# ponto} other {# pontos}}'},
  'items': {'ninja': {'name': 'Ninja', 'tagline': 'Corte tudo o que voa. As bombas, não.'},
            'combinaciones': {'name': 'Combinações', 'tagline': 'Junte três iguais e monte sequências.'},
            'catapulta': {'name': 'Catapulta', 'tagline': 'Três tiros por fase para derrubar a torre.'},
            'dibujo': {'name': 'Desenhe e adivinhe', 'tagline': 'Um desenha e a mesa adivinha.'},
            'hockey': {'name': 'Hóquei', 'tagline': 'Um contra um, até cinco gols.'}},
  'ruleta': {'title': 'Roleta da casa', 'spin': 'Girar a roleta', 'spinning': 'Girando…', 'won': 'Você ganhou: {prize}', 'show': 'Mostre o código ao garçom.',
             'nothing': 'Desta vez não deu. No próximo pedido!', 'nothingShort': 'Outra vez', 'note': 'Um giro por pedido. Prêmios de exemplo: cada local escolhe os seus.'}},
 'juegos': {'title': 'Jogos e roleta', 'sub': 'Os prêmios da roleta, suas chances e o que cada mesa ganhou.', 'prizes': 'Prêmios da roleta', 'prizeName': 'Prêmio',
            'nothing': 'Sem prêmio («Desta vez não deu»)', 'weight': 'Peso', 'remove': 'Tirar {prize}', 'newPrize': 'Novo prêmio', 'add': 'Adicionar um prêmio',
            'rule': 'Um giro por pedido. A porcentagem é a chance de cada prêmio; as fatias da roleta parecem iguais.',
            'handed': 'Prêmios desta noite', 'noneYet': 'Ninguém ganhou nada esta noite ainda.', 'games': 'Jogos que seus clientes veem'}},
}
for loc, v in G.items():
    p = f'/home/user/foody/messages/{loc}.json'
    m = json.load(open(p))
    m['lucero']['games'] = v['games']
    m['lucero']['crm']['juegos'] = v['juegos']
    json.dump(m, open(p, 'w'), ensure_ascii=False, indent=2); open(p, 'a').write('\n')
print('ok')
