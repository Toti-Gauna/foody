# One-off generator for `lucero.mesa` (fases 7-9).
import json
ST = lambda a,b,c,d: {'connecting':a,'online':b,'reconnecting':c,'failed':d}
M = {
'es': {'metaTitle': 'Sala de juego · Lucero (demo)', 'demo': 'Demo', 'code': 'Código de la sala', 'qrAlt': 'QR para entrar a la sala {code}',
  'shareHow': 'Que escaneen el QR, abran el link o pongan el código.', 'copy': 'Copiar el link', 'copied': 'Link copiado', 'waitHost': 'Esperando que quien creó la sala la arranque…',
  'players': '{n, plural, one {# en la sala} other {# en la sala}}', 'hostLabel': 'Creó la sala', 'you': 'vos',
  'status': ST('Conectando…', 'Conectado', 'Reconectando…', 'No se pudo conectar. Probá con la misma WiFi.'),
  'start': 'Empezar', 'needMore': 'Hacen falta {n} para empezar', 'vsGus': 'Jugar contra Gus', 'leave': 'Salir de la sala', 'hostName': 'Mesa 4',
  'badLink': 'Ese link de sala no sirve.', 'toDemo': 'Ir a la demo', 'invited': 'Te invitaron a jugar', 'yourName': 'Tu nombre', 'namePlaceholder': 'Cómo te ven en la sala',
  'join': 'Entrar a la sala', 'note': 'Lucero es un local ficticio: la sala es de prueba.',
  'dibujo': {'starting': 'Arrancando…', 'draw': 'Dibujá', 'was': 'Era', 'maskLabel': 'Palabra de {n} letras', 'round': 'Ronda {n} de {total}', 'choose': 'Elegí qué dibujar:',
    'level': {'0': 'Fácil', '1': 'Media', '2': 'Difícil'}, 'choosing': '{name} está eligiendo qué dibujar…', 'undo': 'Deshacer', 'clear': 'Borrar todo', 'colors': 'Colores', 'sizes': 'Grosor',
    'canvasMine': 'Tu dibujo', 'canvasOf': 'El dibujo de {name}', 'feedRight': '{name} adivinó', 'feedClose': '{name} está muy cerca', 'gotIt': '¡Adivinaste! Esperá a los demás.',
    'guessLabel': 'Tu respuesta', 'guessPlaceholder': '¿Qué es?', 'send': 'Mandar', 'winner': 'Ganó {name}', 'again': 'Otra partida', 'waitAgain': 'Esperando otra partida…'},
  'hockey': {'you': 'Vos', 'to': 'a {n}', 'gus': 'Gus', 'rival': 'Rival', 'tableLabel': 'Mesa de hockey: tu paleta está abajo', 'goalYou': '¡Gol!', 'goalThem': 'Gol de ellos',
    'won': '¡Ganaste!', 'lost': 'Perdiste', 'again': 'Revancha', 'waitAgain': 'Esperando la revancha…', 'help': 'Mové tu paleta con el dedo. Tu arco es el de abajo.'}},
'en': {'metaTitle': 'Game room · Lucero (demo)', 'demo': 'Demo', 'code': 'Room code', 'qrAlt': 'QR to join room {code}',
  'shareHow': 'They scan the QR, open the link or type the code.', 'copy': 'Copy the link', 'copied': 'Link copied', 'waitHost': 'Waiting for the room’s creator to start…',
  'players': '{n, plural, one {# in the room} other {# in the room}}', 'hostLabel': 'Created the room', 'you': 'you',
  'status': ST('Connecting…', 'Connected', 'Reconnecting…', 'Could not connect. Try the same WiFi.'),
  'start': 'Start', 'needMore': 'You need {n} to start', 'vsGus': 'Play against Gus', 'leave': 'Leave the room', 'hostName': 'Table 4',
  'badLink': 'That room link doesn’t work.', 'toDemo': 'Go to the demo', 'invited': 'You’re invited to play', 'yourName': 'Your name', 'namePlaceholder': 'How the room sees you',
  'join': 'Join the room', 'note': 'Lucero is a fictional venue: the room is a test.',
  'dibujo': {'starting': 'Starting…', 'draw': 'Draw', 'was': 'It was', 'maskLabel': '{n}-letter word', 'round': 'Round {n} of {total}', 'choose': 'Pick what to draw:',
    'level': {'0': 'Easy', '1': 'Medium', '2': 'Hard'}, 'choosing': '{name} is picking what to draw…', 'undo': 'Undo', 'clear': 'Clear all', 'colors': 'Colours', 'sizes': 'Brush size',
    'canvasMine': 'Your drawing', 'canvasOf': '{name}’s drawing', 'feedRight': '{name} got it', 'feedClose': '{name} is very close', 'gotIt': 'You got it! Wait for the others.',
    'guessLabel': 'Your answer', 'guessPlaceholder': 'What is it?', 'send': 'Send', 'winner': '{name} wins', 'again': 'Another game', 'waitAgain': 'Waiting for another game…'},
  'hockey': {'you': 'You', 'to': 'to {n}', 'gus': 'Gus', 'rival': 'Rival', 'tableLabel': 'Hockey table: your paddle is at the bottom', 'goalYou': 'Goal!', 'goalThem': 'Their goal',
    'won': 'You won!', 'lost': 'You lost', 'again': 'Rematch', 'waitAgain': 'Waiting for the rematch…', 'help': 'Move your paddle with your finger. Your goal is the bottom one.'}},
'pt': {'metaTitle': 'Sala de jogo · Lucero (demo)', 'demo': 'Demo', 'code': 'Código da sala', 'qrAlt': 'QR para entrar na sala {code}',
  'shareHow': 'Escaneiem o QR, abram o link ou digitem o código.', 'copy': 'Copiar o link', 'copied': 'Link copiado', 'waitHost': 'Esperando quem criou a sala começar…',
  'players': '{n, plural, one {# na sala} other {# na sala}}', 'hostLabel': 'Criou a sala', 'you': 'você',
  'status': ST('Conectando…', 'Conectado', 'Reconectando…', 'Não deu para conectar. Tente na mesma WiFi.'),
  'start': 'Começar', 'needMore': 'Precisa de {n} para começar', 'vsGus': 'Jogar contra o Gus', 'leave': 'Sair da sala', 'hostName': 'Mesa 4',
  'badLink': 'Esse link de sala não funciona.', 'toDemo': 'Ir para a demo', 'invited': 'Você foi convidado para jogar', 'yourName': 'Seu nome', 'namePlaceholder': 'Como a sala vê você',
  'join': 'Entrar na sala', 'note': 'O Lucero é um local fictício: a sala é de teste.',
  'dibujo': {'starting': 'Começando…', 'draw': 'Desenhe', 'was': 'Era', 'maskLabel': 'Palavra de {n} letras', 'round': 'Rodada {n} de {total}', 'choose': 'Escolha o que desenhar:',
    'level': {'0': 'Fácil', '1': 'Média', '2': 'Difícil'}, 'choosing': '{name} está escolhendo o que desenhar…', 'undo': 'Desfazer', 'clear': 'Apagar tudo', 'colors': 'Cores', 'sizes': 'Espessura',
    'canvasMine': 'Seu desenho', 'canvasOf': 'O desenho de {name}', 'feedRight': '{name} acertou', 'feedClose': '{name} está quase', 'gotIt': 'Acertou! Espere os outros.',
    'guessLabel': 'Sua resposta', 'guessPlaceholder': 'O que é?', 'send': 'Enviar', 'winner': '{name} ganhou', 'again': 'Outra partida', 'waitAgain': 'Esperando outra partida…'},
  'hockey': {'you': 'Você', 'to': 'até {n}', 'gus': 'Gus', 'rival': 'Rival', 'tableLabel': 'Mesa de hóquei: seu taco está embaixo', 'goalYou': 'Gol!', 'goalThem': 'Gol deles',
    'won': 'Você ganhou!', 'lost': 'Você perdeu', 'again': 'Revanche', 'waitAgain': 'Esperando a revanche…', 'help': 'Mova o taco com o dedo. O seu gol é o de baixo.'}},
}
for loc, v in M.items():
    p = f'/home/user/foody/messages/{loc}.json'
    m = json.load(open(p)); m['lucero']['mesa'] = v
    json.dump(m, open(p, 'w'), ensure_ascii=False, indent=2); open(p, 'a').write('\n')
print('ok')
