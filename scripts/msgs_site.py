# One-off generator for the site's copy (fase 1-2). Kept so the three locales stay in step; edit messages/*.json directly afterwards.
import json, copy
R = '/home/user/toti-gauna/roofy/messages/%s.json'
E = '/home/user/toti-gauna/eclipse-web/messages/%s.json'
ROOFY_NAME = {'es': 'Eclipse para inmobiliarias', 'en': 'Eclipse for real estate', 'pt': 'Eclipse para imobiliárias'}

S = {
'es': {
 'skip': 'Ir al contenido', 'brand': 'Eclipse', 'tagline': 'para restaurantes', 'demoBadge': 'Demo',
 'nav': {'label': 'Secciones', 'offer': 'Qué ofrecemos', 'demo': 'Demo', 'plans': 'Planes', 'others': 'Otros negocios'},
 'hero': {'section': 'Inicio', 'sub': 'Tu local también en el celular: la carta con Gus, el mozo que anota cada pedido, el CRM del local y juegos para la mesa.',
          'cta': 'Ver qué ofrecemos', 'demo': 'Probar la demo', 'status': 'En preparación', 'from': 'Desde {price} por mes',
          'statusNote': 'Tres planes con precio publicado. Lo coordinamos por WhatsApp.', 'demoNote': 'Lucero es un local ficticio, hecho para mostrar el producto.'},
 'offer': {'section': 'Qué ofrecemos', 'title': 'Todo lo que pasa <em>en la mesa</em>.',
           'lead': 'Quien se sienta escanea el QR, mira la carta y pide. Gus anota, lleva la comanda a la cocina y vuelve con el plato. Vos lo ves todo en el CRM.',
           'from': 'Desde el plan {price}',
           'items': {
             'carta': {'name': 'Carta con Gus', 'text': 'La carta en el celular, con un mozo animado que anota cada plato, lleva la comanda y vuelve con la bandeja.'},
             'crm': {'name': 'CRM del local', 'text': 'Pedidos en vivo, cocina, clientes con su historial y la carta con stock, en una sola pantalla.'},
             'juegos': {'name': 'Juegos y ruleta', 'text': 'Mientras esperan la comida: juegos para el celular y una ruleta para ganar el menú del día o una promo.'},
             'academy': {'name': 'Mesa y Academy', 'text': 'Juegos para jugar entre todos —dibujar y adivinar, hockey— y Eclipse Academy: ideas de marketing digital y físico.'}},
           'soonLabel': 'Próximamente', 'soonNote': 'Todavía no está en ningún plan',
           'soon': {'reservas': 'Reservas', 'web': 'Web del local', 'platos': 'Platos en 3D'}},
 'demo': {'section': 'Demo', 'title': 'Probalo antes de <em>elegir</em>.',
          'lead': 'Lucero es un local ficticio. Pedí desde la mesa como un cliente y mirá el CRM del local al mismo tiempo.',
          'steps': {'pedir': 'Pedir desde la mesa', 'gus': 'Ver a Gus llevar la comanda', 'jugar': 'Jugar mientras llega la comida', 'crm': 'Atender el pedido en el CRM'},
          'inDemo': 'En la demo', 'open': 'Abrir la demo', 'crm': 'Ver el CRM del local', 'asPlan': 'Ver la demo como el plan', 'plan': 'Plan {price}'},
 'plans': {'section': 'Planes', 'title': 'Tres planes. <em>Elegí el tuyo.</em>',
           'lead': 'En dólares, por mes. Cada plan incluye todo lo del anterior.',
           'perMonth': 'por mes', 'includes': 'Incluye', 'plus': 'Todo lo del plan {price}, y además',
           'cta': 'Quiero este plan', 'demo': 'Ver la demo de este plan', 'whatsappNote': 'Se abre en WhatsApp',
           'message': 'Hola, quiero el plan de {price} por mes de Eclipse para restaurantes para mi local.',
           'note': 'Eclipse para restaurantes está en preparación: escribinos y coordinamos el inicio. En este sitio no se cobra nada.',
           'items': {
             '25': {'name': 'Carta y CRM', 'tagline': 'Tu carta en el celular y tu local en orden.', 'points': {'carta': 'Carta por QR en cada mesa', 'gus': 'Gus, el mozo animado que anota y lleva la comanda', 'crm': 'CRM del local: pedidos, cocina, clientes y stock'}},
             '50': {'name': 'Juegos y ruleta', 'tagline': 'Más motivos para quedarse y volver.', 'points': {'juegos': 'Juegos para el celular mientras esperan', 'ruleta': 'Ruleta para ganar el menú del día o una promo', 'premios': 'Premios y probabilidades que elegís en el CRM'}},
             '75': {'name': 'Mesa y Academy', 'tagline': 'La mesa juega junta y tu local aprende.', 'points': {'mesa': 'Juegos para toda la mesa: dibujar y adivinar, hockey', 'salas': 'Salas con link, código o QR para sumarse', 'academy': 'Eclipse Academy: marketing digital y físico'}}}},
 'others': {'section': 'Otros negocios', 'title': 'Y para <em>otros negocios</em>.',
            'sub': 'Eclipse tiene un producto por rubro. Hoy se vende Eclipse para inmobiliarias; el resto está en preparación o es lo próximo. Acá no hay precios.',
            'listLabel': 'Productos de Eclipse para otros negocios',
            'status': {'available': 'Disponible', 'planned': 'En preparación', 'launch': 'Lanza el {date}', 'soon': 'Próximamente'},
            'noPrice': 'Sin precio publicado todavía', 'soonNote': 'Sin precio ni fecha todavía', 'forLabel': 'Eclipse para',
            'notify': 'Avisame cuando esté', 'ask': 'Pedir información', 'visit': 'Conocer Eclipse para inmobiliarias',
            'whatsappNote': 'Se abre en WhatsApp', 'siteNote': 'Se abre su sitio'},
 'close': {'section': 'Cierre', 'title': 'Tu local, a <em>plena luz</em>.', 'cta': 'Hablar por WhatsApp', 'demo': 'Probar la demo',
           'message': 'Hola, tengo un local gastronómico y quiero saber más de Eclipse para restaurantes.',
           'faq': {'pay': {'q': '¿Cómo se paga?', 'a': 'Se coordina por WhatsApp cuando elegís el plan. En este sitio no se cobra nada.'},
                   'who': {'q': '¿Ya lo usa algún local?', 'a': 'Todavía no: está en preparación. Lucero, el local de la demo, es ficticio.'},
                   'need': {'q': '¿Qué necesita mi local?', 'a': 'Un celular o una compu para el CRM, y los códigos QR en las mesas.'}}},
 'footer': {'label': 'Pie de página', 'back': 'Volver a Eclipse', 'note': 'Sitio de prueba · Lucero y sus datos son ficticios'},
},
'en': {
 'skip': 'Skip to content', 'brand': 'Eclipse', 'tagline': 'for restaurants', 'demoBadge': 'Demo',
 'nav': {'label': 'Sections', 'offer': 'What we offer', 'demo': 'Demo', 'plans': 'Plans', 'others': 'Other businesses'},
 'hero': {'section': 'Home', 'sub': 'Your venue on the phone too: the menu with Gus, the waiter who takes every order, the venue CRM and games for the table.',
          'cta': 'See what we offer', 'demo': 'Try the demo', 'status': 'In the works', 'from': 'From {price} a month',
          'statusNote': 'Three plans with published prices. We set it up over WhatsApp.', 'demoNote': 'Lucero is a fictional venue, built to show the product.'},
 'offer': {'section': 'What we offer', 'title': 'Everything that happens <em>at the table</em>.',
           'lead': 'Guests scan the QR, browse the menu and order. Gus writes it down, takes the ticket to the kitchen and comes back with the dish. You see it all in the CRM.',
           'from': 'From the {price} plan',
           'items': {
             'carta': {'name': 'Menu with Gus', 'text': 'The menu on the phone, with an animated waiter who writes down every dish, takes the ticket and comes back with the tray.'},
             'crm': {'name': 'Venue CRM', 'text': 'Live orders, kitchen, customers with their history and the menu with stock, on one screen.'},
             'juegos': {'name': 'Games and wheel', 'text': 'While the food is on its way: phone games and a prize wheel to win the daily menu or a deal.'},
             'academy': {'name': 'Table and Academy', 'text': 'Games for everyone at the table —draw and guess, hockey— and Eclipse Academy: ideas for digital and on-site marketing.'}},
           'soonLabel': 'Coming soon', 'soonNote': 'Not in any plan yet',
           'soon': {'reservas': 'Bookings', 'web': 'Venue website', 'platos': '3D dishes'}},
 'demo': {'section': 'Demo', 'title': 'Try it before you <em>choose</em>.',
          'lead': 'Lucero is a fictional venue. Order from the table as a guest and watch the venue CRM at the same time.',
          'steps': {'pedir': 'Order from the table', 'gus': 'Watch Gus take the ticket', 'jugar': 'Play while the food comes', 'crm': 'Handle the order in the CRM'},
          'inDemo': 'In the demo', 'open': 'Open the demo', 'crm': 'See the venue CRM', 'asPlan': 'See the demo as the plan', 'plan': '{price} plan'},
 'plans': {'section': 'Plans', 'title': 'Three plans. <em>Pick yours.</em>',
           'lead': 'In US dollars, per month. Each plan includes everything in the one before.',
           'perMonth': 'a month', 'includes': 'Includes', 'plus': 'Everything in the {price} plan, plus',
           'cta': 'I want this plan', 'demo': 'See this plan’s demo', 'whatsappNote': 'Opens in WhatsApp',
           'message': 'Hi, I want the {price} a month plan of Eclipse for restaurants for my venue.',
           'note': 'Eclipse for restaurants is in the works: message us and we set up the start. Nothing is charged on this site.',
           'items': {
             '25': {'name': 'Menu and CRM', 'tagline': 'Your menu on the phone and your venue in order.', 'points': {'carta': 'QR menu on every table', 'gus': 'Gus, the animated waiter who writes and carries the ticket', 'crm': 'Venue CRM: orders, kitchen, customers and stock'}},
             '50': {'name': 'Games and wheel', 'tagline': 'More reasons to stay and come back.', 'points': {'juegos': 'Phone games while they wait', 'ruleta': 'A wheel to win the daily menu or a deal', 'premios': 'Prizes and odds you set in the CRM'}},
             '75': {'name': 'Table and Academy', 'tagline': 'The table plays together and your venue learns.', 'points': {'mesa': 'Games for the whole table: draw and guess, hockey', 'salas': 'Rooms you join with a link, a code or a QR', 'academy': 'Eclipse Academy: digital and on-site marketing'}}}},
 'others': {'section': 'Other businesses', 'title': 'And for <em>other businesses</em>.',
            'sub': 'Eclipse has one product per industry. Today Eclipse for real estate is on sale; the rest are in the works or coming next. No prices here.',
            'listLabel': 'Eclipse products for other businesses',
            'status': {'available': 'Available', 'planned': 'In the works', 'launch': 'Launches {date}', 'soon': 'Coming soon'},
            'noPrice': 'No published price yet', 'soonNote': 'No price or date yet', 'forLabel': 'Eclipse for',
            'notify': 'Let me know when it’s ready', 'ask': 'Ask for information', 'visit': 'See Eclipse for real estate',
            'whatsappNote': 'Opens in WhatsApp', 'siteNote': 'Opens its website'},
 'close': {'section': 'Closing', 'title': 'Your venue, in <em>full light</em>.', 'cta': 'Talk on WhatsApp', 'demo': 'Try the demo',
           'message': 'Hi, I run a food venue and want to know more about Eclipse for restaurants.',
           'faq': {'pay': {'q': 'How do I pay?', 'a': 'We set it up over WhatsApp once you pick a plan. Nothing is charged on this site.'},
                   'who': {'q': 'Does any venue use it yet?', 'a': 'Not yet: it is in the works. Lucero, the demo venue, is fictional.'},
                   'need': {'q': 'What does my venue need?', 'a': 'A phone or a computer for the CRM, and the QR codes on the tables.'}}},
 'footer': {'label': 'Footer', 'back': 'Back to Eclipse', 'note': 'Test site · Lucero and its data are fictional'},
},
'pt': {
 'skip': 'Ir para o conteúdo', 'brand': 'Eclipse', 'tagline': 'para restaurantes', 'demoBadge': 'Demo',
 'nav': {'label': 'Seções', 'offer': 'O que oferecemos', 'demo': 'Demo', 'plans': 'Planos', 'others': 'Outros negócios'},
 'hero': {'section': 'Início', 'sub': 'Seu local também no celular: o cardápio com o Gus, o garçom que anota cada pedido, o CRM do local e jogos para a mesa.',
          'cta': 'Ver o que oferecemos', 'demo': 'Testar a demo', 'status': 'Em preparação', 'from': 'A partir de {price} por mês',
          'statusNote': 'Três planos com preço publicado. Combinamos pelo WhatsApp.', 'demoNote': 'O Lucero é um local fictício, feito para mostrar o produto.'},
 'offer': {'section': 'O que oferecemos', 'title': 'Tudo o que acontece <em>na mesa</em>.',
           'lead': 'Quem senta escaneia o QR, vê o cardápio e pede. O Gus anota, leva a comanda para a cozinha e volta com o prato. Você vê tudo no CRM.',
           'from': 'A partir do plano {price}',
           'items': {
             'carta': {'name': 'Cardápio com o Gus', 'text': 'O cardápio no celular, com um garçom animado que anota cada prato, leva a comanda e volta com a bandeja.'},
             'crm': {'name': 'CRM do local', 'text': 'Pedidos ao vivo, cozinha, clientes com histórico e o cardápio com estoque, numa tela só.'},
             'juegos': {'name': 'Jogos e roleta', 'text': 'Enquanto a comida não chega: jogos no celular e uma roleta para ganhar o prato do dia ou uma promoção.'},
             'academy': {'name': 'Mesa e Academy', 'text': 'Jogos para a mesa toda —desenhar e adivinhar, hóquei— e a Eclipse Academy: ideias de marketing digital e presencial.'}},
           'soonLabel': 'Em breve', 'soonNote': 'Ainda não está em nenhum plano',
           'soon': {'reservas': 'Reservas', 'web': 'Site do local', 'platos': 'Pratos em 3D'}},
 'demo': {'section': 'Demo', 'title': 'Teste antes de <em>escolher</em>.',
          'lead': 'O Lucero é um local fictício. Peça da mesa como cliente e veja o CRM do local ao mesmo tempo.',
          'steps': {'pedir': 'Pedir da mesa', 'gus': 'Ver o Gus levar a comanda', 'jugar': 'Jogar enquanto a comida chega', 'crm': 'Atender o pedido no CRM'},
          'inDemo': 'Na demo', 'open': 'Abrir a demo', 'crm': 'Ver o CRM do local', 'asPlan': 'Ver a demo como o plano', 'plan': 'Plano {price}'},
 'plans': {'section': 'Planos', 'title': 'Três planos. <em>Escolha o seu.</em>',
           'lead': 'Em dólares, por mês. Cada plano inclui tudo do anterior.',
           'perMonth': 'por mês', 'includes': 'Inclui', 'plus': 'Tudo do plano {price}, e mais',
           'cta': 'Quero este plano', 'demo': 'Ver a demo deste plano', 'whatsappNote': 'Abre no WhatsApp',
           'message': 'Olá, quero o plano de {price} por mês do Eclipse para restaurantes para o meu local.',
           'note': 'O Eclipse para restaurantes está em preparação: fale com a gente e combinamos o início. Neste site nada é cobrado.',
           'items': {
             '25': {'name': 'Cardápio e CRM', 'tagline': 'Seu cardápio no celular e seu local em ordem.', 'points': {'carta': 'Cardápio por QR em cada mesa', 'gus': 'O Gus, garçom animado que anota e leva a comanda', 'crm': 'CRM do local: pedidos, cozinha, clientes e estoque'}},
             '50': {'name': 'Jogos e roleta', 'tagline': 'Mais motivos para ficar e voltar.', 'points': {'juegos': 'Jogos no celular enquanto esperam', 'ruleta': 'Roleta para ganhar o prato do dia ou uma promoção', 'premios': 'Prêmios e chances que você define no CRM'}},
             '75': {'name': 'Mesa e Academy', 'tagline': 'A mesa joga junta e seu local aprende.', 'points': {'mesa': 'Jogos para a mesa toda: desenhar e adivinhar, hóquei', 'salas': 'Salas com link, código ou QR para entrar', 'academy': 'Eclipse Academy: marketing digital e presencial'}}}},
 'others': {'section': 'Outros negócios', 'title': 'E para <em>outros negócios</em>.',
            'sub': 'A Eclipse tem um produto por segmento. Hoje está à venda o Eclipse para imobiliárias; os outros estão em preparação ou vêm a seguir. Aqui não há preços.',
            'listLabel': 'Produtos da Eclipse para outros negócios',
            'status': {'available': 'Disponível', 'planned': 'Em preparação', 'launch': 'Lança em {date}', 'soon': 'Em breve'},
            'noPrice': 'Sem preço publicado ainda', 'soonNote': 'Sem preço nem data ainda', 'forLabel': 'Eclipse para',
            'notify': 'Me avise quando estiver pronto', 'ask': 'Pedir informações', 'visit': 'Conhecer o Eclipse para imobiliárias',
            'whatsappNote': 'Abre no WhatsApp', 'siteNote': 'Abre o site dele'},
 'close': {'section': 'Fechamento', 'title': 'Seu local, em <em>plena luz</em>.', 'cta': 'Falar pelo WhatsApp', 'demo': 'Testar a demo',
           'message': 'Olá, tenho um local de comida e quero saber mais do Eclipse para restaurantes.',
           'faq': {'pay': {'q': 'Como se paga?', 'a': 'Combinamos pelo WhatsApp quando você escolhe o plano. Neste site nada é cobrado.'},
                   'who': {'q': 'Algum local já usa?', 'a': 'Ainda não: está em preparação. O Lucero, local da demo, é fictício.'},
                   'need': {'q': 'Do que meu local precisa?', 'a': 'Um celular ou um computador para o CRM, e os QR codes nas mesas.'}}},
 'footer': {'label': 'Rodapé', 'back': 'Voltar para a Eclipse', 'note': 'Site de teste · O Lucero e seus dados são fictícios'},
}}

for loc in ('es', 'en', 'pt'):
    path = f'/home/user/foody/messages/{loc}.json'
    m = json.load(open(path))
    m.pop('placeholder', None)
    r = json.load(open(R % loc))
    e = json.load(open(E % loc))
    site = copy.deepcopy(S[loc])
    items = {k: v for k, v in r['site']['others']['items'].items() if k != 'foody'}
    ro = e['products']['items']['roofy']
    items = {'roofy': {'name': ROOFY_NAME[loc], 'title': ro['title'], 'rubro': ro['rubro'], 'line': ro['line'], 'points': ro['points'], 'ask': ro['ask']}, **items}
    site['others']['items'] = items
    m['site'] = site
    m['autoTour'] = r['autoTour']
    json.dump(m, open(path, 'w'), ensure_ascii=False, indent=2)
    open(path, 'a').write('\n')
print('ok')
