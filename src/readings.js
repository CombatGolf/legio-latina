// Original graded texts, followed by two ancient excerpts. Each line has its own
// translation, a reading note and a question about a detail of the Latin.
const text = (id, level, title, intro, lines, source) => ({ id, level, title, intro, lines, source });
const line = (latin, pt, note, question, answer, ...distractors) =>
  ({ latin, pt, note, question, answer, distractors });

export const readings = [
  text('salve', 1, 'Ao pé da porta', 'Duas pessoas se encontram à entrada. Repare em quem fala e a quantas pessoas.', [
    line('«Salvē! Ego sum Iūlia.»','“Olá! Eu sou Júlia.”','Salvē saúda uma pessoa. Ego e sum apontam para quem está falando.','Quem se apresenta?','Júlia','Marco','Os dois ao mesmo tempo'),
    line('«Salvē, Iūlia! Ego sum Mārcus.»','“Olá, Júlia! Eu sou Marco.”','O nome Iūlia entre vírgulas indica com quem Marco fala.','A quem Marco dirige a saudação?','A Júlia','A um grupo','Ao narrador'),
    line('«Valē, Mārce!»','“Adeus, Marco!”','Valē despede uma pessoa. Mārce é o vocativo de Mārcus.','O que está acontecendo?','Uma despedida','Uma apresentação','Uma ordem')
  ]),
  text('fons', 2, 'Água na estrada', 'Júlia vê uma garota perto de uma fonte. Observe quem faz cada ação.', [
    line('Via longa est.','A estrada é longa.','Via é o sujeito e longa concorda com via.','O que é descrito como longo?','A estrada','O dia','O muro'),
    line('Iūlia puellam videt.','Júlia vê uma menina.','Puellam termina em -am e é o objeto de videt.','Quem vê?','Júlia','A menina','As meninas'),
    line('Puella aquam portat.','A menina carrega água.','Puella volta como sujeito, desta vez sem -m.','O que a menina leva?','Água','Um livro','Uma espada')
  ]),
  text('templum', 3, 'O templo e a espada', 'Acompanhe dois amigos e observe como o plural muda a leitura.', [
    line('Amīcī templum vident.','Os amigos veem o templo.','Vident é plural. Isso ajuda a ler amīcī como “os amigos”.','Quantas pessoas veem o templo?','Mais de uma','Uma só','O texto não permite saber'),
    line('Gladius amīcī novus est.','A espada do amigo é nova.','Agora amīcī é genitivo: “do amigo”. Gladius é o sujeito de est.','De quem é a espada?','Do amigo','Dos amigos','Do soldado'),
    line('Templa magna sunt.','Os templos são grandes.','Templa e magna são neutros plurais.','O que permite reconhecer o plural?','Templa, magna e sunt','Só o gênero neutro','O verbo est')
  ]),
  text('gladius', 4, 'O aviso de Júlia', 'A fala passa de uma personagem para outra. Repare nas terminações dos verbos.', [
    line('«Gladium portō», Iūlia dīcit.','“Eu carrego uma espada”, diz Júlia.','A primeira pessoa em portō pertence a Júlia, a personagem que fala.','Quem carrega a espada?','Júlia','O interlocutor','O narrador'),
    line('«Nōs templum vidēmus.»','“Nós vemos o templo.”','Vidēmus traz a terminação -mus, suficiente para indicar “nós”.','Qual palavra mostra que mais de uma pessoa vê?','vidēmus','templum','videt'),
    line('Iūlia mīlitēs monet.','Júlia avisa os soldados.','Monet tem sujeito singular. Mīlitēs está no acusativo plural.','Quem recebe o aviso?','Os soldados','Júlia','Os marinheiros')
  ]),
  text('rex', 5, 'O rei junto aos muros', 'Os nomes da terceira declinação mudam de radical entre as formas mais comuns.', [
    line('Mūrī urbis altī sunt.','Os muros da cidade são altos.','Urbis é genitivo singular. Mūrī e altī estão no nominativo plural.','O que é alto?','Os muros','A cidade','O rei'),
    line('Rēx mīlitem videt.','O rei vê o soldado.','Rēx é sujeito. Mīlitem é objeto, formado sobre mīlit-.','Quem é visto?','O soldado','O rei','Os muros'),
    line('Mīles rēgem salūtat.','O soldado saúda o rei.','Rēgem mostra o radical rēg- e o acusativo singular -em.','Por que aparece rēgem?','O rei recebe a saudação','O rei saúda o soldado','Há mais de um rei')
  ]),
  text('liber', 6, 'O livro no templo', 'Um percurso curto distingue localização, destino e destinatário.', [
    line('Mīles in urbe est.','O soldado está na cidade.','In urbe está no ablativo e indica localização.','A cidade é o quê na frase?','O lugar onde o soldado está','O lugar para onde ele vai','O lugar de onde ele saiu'),
    line('Amīcus mīlitī librum dat.','O amigo dá um livro ao soldado.','Amīcus é quem dá, librum é o objeto e mīlitī é quem recebe.','Quem recebe o livro?','O soldado','O amigo','O rei'),
    line('Mīles in templum intrat.','O soldado entra no templo.','In templum é acusativo e indica destino.','Como se diz “no templo”, estando lá dentro?','in templō','in templum','templī')
  ]),
  text('manus', 7, 'Um dia de trabalho', 'Uma ordem breve põe os amigos em movimento. Compare mão, mãos e com a mão.', [
    line('Diēs longus est.','O dia é longo.','Longus concorda com diēs, masculino neste uso.','Qual é o sujeito?','diēs','longus','est'),
    line('«Amīcī, portāte librōs!»','“Amigos, tragam os livros!”','Portāte dirige a ordem a mais de uma pessoa. Amīcī é vocativo plural.','Qual seria a ordem para uma pessoa?','portā','portat','portant'),
    line('Iūlia librum manū tenet.','Júlia segura o livro com a mão.','Manū está no ablativo de meio. Librum é objeto direto.','Qual palavra diz com que meio Júlia segura o livro?','manū','librum','Iūlia')
  ]),
  text('epistula', 8, 'Uma carta em três tempos', 'Júlia escreve, o amigo chega e os dois têm planos para amanhã.', [
    line('Iūlia epistulam scrībēbat.','Júlia escrevia uma carta.','O imperfeito apresenta a escrita em andamento.','Como o texto apresenta a ação?','Estava em andamento','Vai acontecer amanhã','Já terminou neste ponto'),
    line('Tum amīcus vēnit.','Então o amigo chegou.','Tum avança a narrativa. Vēnit, com ē, é perfeito de veniō.','Qual acontecimento avança a narrativa?','O amigo chegou','Júlia escreveu amanhã','O amigo escrevia'),
    line('«Crās epistulam portābō.»','“Amanhã levarei a carta.”','Crās localiza a ação no futuro. Portābō indica quem fala: “eu”.','Qual é o plano para amanhã?','Levar a carta','Escrever a carta','Esperar o amigo')
  ]),
  text('porta', 9, 'Relato do portão', 'O leitor chega depois da ação. Reconstrua a ordem em que as coisas ocorreram.', [
    line('Epistula quam Iūlia scrīpserat in templō erat.','A carta que Júlia tinha escrito estava no templo.','Quam retoma epistula, mas recebe acusativo por ser objeto de scrīpserat.','O que já tinha acontecido?','Júlia tinha escrito a carta','O soldado tinha chegado','A carta tinha sido lida'),
    line('Mīles quī herī vēnit epistulam lēgit.','O soldado que chegou ontem leu a carta.','Quī é sujeito de vēnit. O verbo da oração principal é lēgit, perfeito de legō.','Qual é a ação principal do soldado?','Ler a carta','Escrever a carta','Colocar a carta no templo'),
    line('Epistula nunc ā mīlite portātur.','Agora a carta é carregada pelo soldado.','A carta é o sujeito da passiva. Ā mīlite identifica o agente.','Quem leva a carta?','O soldado','Júlia','Um amigo')
  ]),
  text('caesar', 9, 'César divide a Gália', 'Leia um trecho de autor antigo com apoio. Os nomes dos povos estão conservados no texto latino.', [
    line('Gallia est omnis dīvīsa in partēs trēs.','A Gália inteira está dividida em três partes.','Dīvīsa concorda com Gallia. In partēs descreve o resultado da divisão.','O que trēs quantifica?','As partes','Os povos','As línguas'),
    line('Quārum ūnam incolunt Belgae, aliam Aquītānī, tertiam quī ipsōrum linguā Celtae, nostrā Gallī appellantur.','Uma delas é habitada pelos belgas, outra pelos aquitanos e a terceira pelos que na própria língua são chamados celtas e, na nossa, gauleses.','Quārum retoma partēs. Incolunt, “habitam”, fica implícito após o primeiro grupo. Nostrā subentende linguā.','Celtae e Gallī designam quem?','O mesmo grupo, em línguas diferentes','Dois dos três grupos','Belgas e aquitanos, respectivamente')
  ], {label:'Júlio César · De bellō Gallicō 1.1 · trecho', url:'https://www.perseus.tufts.edu/hopper/text?doc=Caes.+Gal.+1.1'}),
  text('catullus', 9, 'Catulo em dois versos', 'O poema põe sentimentos opostos na mesma frase. Experimente ler os dois versos em voz alta.', [
    line('Ōdī et amō. Quārē id faciam, fortasse requīris.','Odeio e amo. Talvez você pergunte por que faço isso.','Ōdī tem forma de perfeito, mas sentido de presente. A pergunta indireta usa faciam, subjuntivo.','Quais sentimentos aparecem juntos?','Ódio e amor','Amor e medo','Ódio e alegria'),
    line('Nesciō, sed fierī sentiō et excrucior.','Não sei, mas sinto que acontece e sou atormentado.','Fierī é infinitivo. Excrucior está na primeira pessoa singular passiva.','O poeta afirma que entende a causa?','Não. Ele sente o efeito','Sim. Ele explica a causa','Ele não percebe o efeito')
  ], {label:'Catulo · Carmen 85', url:'https://www.perseus.tufts.edu/hopper/text?doc=Catul.+85'})
];
