// New chapters continue the original campaign IDs. All practice sentences are original.
const lesson = (id, title, focus, tip, phrases, words, quiz) =>
  ({ id, title, focus, tip, phrases, words, quiz });

export const expansion = [
  { id:'vii', numeral:'VII', title:'Vozes da cidade', subtitle:'Quarta e quinta declinações, concordância e ordens', lessons:[
    lesson('vii-1','Mãos à obra','Quarta declinação','O genitivo singular em -ūs identifica a quarta declinação. Manus é feminino, apesar do nominativo em -us. Compare manum (objeto singular), manūs (sujeito plural) e manū (ablativo singular).',[
      ['Manus est parva.','A mão é pequena.'],
      ['Mīles manum levat.','O soldado levanta a mão.',['O soldado ergue a mão.','O soldado levanta sua mão.']],
      ['Manūs parvae sunt.','As mãos são pequenas.',['As mãos são pequeninas.']],
      ['Puella librum manū tenet.','A menina segura o livro com a mão.',['A garota segura o livro com a mão.','Com a mão, a menina segura o livro.']]
    ],[['manus','mão'],['manum','mão (objeto singular)'],['manū','com a mão'],['levat','levanta']],
    ['Por que parva termina em -a?',['Manus é feminino','Manus é neutro','Manus está no plural'],'Manus é feminino','O gênero de manus é feminino. A forma do adjetivo acompanha esse gênero.']),
    lesson('vii-2','O dia e as coisas','Quinta declinação','A quinta declinação tem genitivo singular em -eī ou -ēī. Rēs, reī quer dizer “coisa” ou “assunto”. Diēs, diēī normalmente é masculino, mas pode ser feminino em alguns usos, como uma data fixada.',[
      ['Rēs nova est.','O assunto é novo.'],
      ['Diēs longus est.','O dia é longo.'],
      ['Rēs novās vidēmus.','Vemos coisas novas.',['Nós vemos coisas novas.','Enxergamos coisas novas.']],
      ['In illō diē mīles venit.','Naquele dia, o soldado vem.',['O soldado vem naquele dia.']]
    ],[['rēs','coisa ou assunto'],['reī','da coisa'],['diēs','dia'],['diē','dia (ablativo)']],
    ['Qual é o genitivo singular de rēs?',['reī','rem','rē'],'reī','Rēs tem genitivo reī. Rem é acusativo e rē é ablativo.']),
    lesson('vii-3','Capas e espadas','Concordância','Adjetivos concordam com o substantivo em gênero, número e caso. As terminações podem ser diferentes. Em mīlitem bonum, ambos são masculinos, singulares e acusativos, embora mīles seja da terceira declinação e bonus siga a segunda.',[
      ['Via longa est.','A estrada é longa.'],
      ['Templa magna sunt.','Os templos são grandes.'],
      ['Mīlitem bonum videō.','Vejo um bom soldado.',['Eu vejo um bom soldado.','Vejo um soldado bom.','Eu vejo um soldado bom.']],
      ['Puella gladium novum portat.','A menina carrega uma espada nova.',['A garota leva uma espada nova.','A menina leva uma espada nova.']]
    ],[['bonus','bom (masculino)'],['bona','boa (feminino)'],['bonum','bom (neutro ou acusativo masc.)'],['mīlitem','soldado (objeto)']],
    ['Qual adjetivo acompanha mīlitem?',['bonum','bonus','bonae'],'bonum','Mīlitem é masculino acusativo singular. Bonum concorda com ele nessas três categorias.']),
    lesson('vii-4','Ordens no portão','Imperativo e vocativo','Use o imperativo para dirigir uma ordem. No modelo portāre, portā fala com uma pessoa e portāte com várias. O nome da pessoa chamada vai no vocativo. Amīcus vira amīce.',[
      ['Amīce, portā aquam!','Amigo, traga água!'],
      ['Portāte librōs!','Tragam os livros!'],
      ['Mārce, vidē templum!','Marco, veja o templo!',['Marcos, veja o templo!','Marco, vê o templo!','Marco, olhe o templo!']],
      ['Amīcī, audīte verba!','Amigos, ouçam as palavras!',['Amigos, escutem as palavras!','Amigos, ouvi as palavras!']]
    ],[['portā','carregue (singular)'],['portāte','carreguem (plural)'],['amīce','ó amigo'],['audīte','ouçam']],
    ['Qual ordem se dirige a várias pessoas?',['portāte','portā','portat'],'portāte','Portāte é o imperativo plural. Portat é indicativo: ele ou ela carrega.'])
  ]},
  { id:'viii', numeral:'VIII', title:'Ontem e amanhã', subtitle:'Terceira e quarta conjugações, passado e futuro', lessons:[
    lesson('viii-1','Cartas na estrada','Presente de scrībere e audīre','Scrībere é da terceira conjugação. Audīre é da quarta. Compare scrībit e audit na terceira pessoa singular, scrībunt e audiunt na terceira pessoa plural.',[
      ['Scrībō epistulam.','Escrevo uma carta.'],
      ['Iūlia verba audit.','Júlia ouve as palavras.'],
      ['Mīlitēs epistulās scrībunt.','Os soldados escrevem cartas.',['Os soldados escrevem as cartas.']],
      ['Puellae magistram audiunt.','As meninas ouvem a professora.',['As garotas escutam a professora.','As meninas escutam a professora.']]
    ],[['scrībō','escrevo'],['scrībunt','escrevem'],['audit','ouve'],['audiunt','ouvem']],
    ['Qual forma significa “eles ouvem”?',['audiunt','audit','audīmus'],'audiunt','Audiunt é terceira pessoa do plural. O grupo -iunt aparece no presente da quarta conjugação.']),
    lesson('viii-2','Enquanto chovia','Pretérito imperfeito','O imperfeito pode descrever uma ação em curso ou habitual no passado. Reconheça -bā- em amābam, portābat e scrībēbant, com vogal breve antes de -t e -nt. Em português, “escrevia” e “estava escrevendo” podem servir conforme o contexto.',[
      ['Iūlia aquam portābat.','Júlia carregava água.'],
      ['Ego in urbe habitābam.','Eu morava na cidade.'],
      ['Mīles epistulam scrībēbat.','O soldado escrevia uma carta.',['O soldado estava escrevendo uma carta.','O soldado escrevia a carta.']],
      ['Puellae cantābant.','As meninas cantavam.',['As meninas estavam cantando.','As garotas cantavam.']]
    ],[['portābat','carregava'],['habitābam','morava'],['scrībēbat','escrevia'],['cantābant','cantavam']],
    ['Qual forma descreve uma ação em curso no passado?',['scrībēbat','scrībit','scrīpsit'],'scrībēbat','Scrībēbat é imperfeito. Scrībit é presente e scrīpsit é perfeito.']),
    lesson('viii-3','A carta chegou','Pretérito perfeito','O perfeito pode narrar um acontecimento concluído. Compare scrībēbat (“escrevia”) com scrīpsit (“escreveu”). Consulte a terceira forma principal do verbo, como scrīpsī para scrībere, para identificar o radical do perfeito.',[
      ['Iūlia epistulam scrīpsit.','Júlia escreveu uma carta.'],
      ['Mīles aquam portāvit.','O soldado carregou água.'],
      ['Amīcus herī vēnit.','O amigo veio ontem.',['Ontem, o amigo veio.','O amigo chegou ontem.','Ontem, o amigo chegou.']],
      ['Puellae magistram audīvērunt.','As meninas ouviram a professora.',['As meninas escutaram a professora.','As garotas ouviram a professora.']]
    ],[['scrīpsit','escreveu'],['portāvit','carregou'],['vēnit','veio'],['herī','ontem']],
    ['Qual par distingue imperfeito e perfeito, nessa ordem?',['scrībēbat e scrīpsit','scrīpsit e scrībēbat','scrībit e scrībēbat'],'scrībēbat e scrīpsit','Scrībēbat apresenta a ação em curso. Scrīpsit apresenta o acontecimento concluído.']),
    lesson('viii-4','Amanhã marcharemos','Futuro do indicativo','A primeira e a segunda conjugações usam formas como portābō, portābis, portābit e vidēbō. Na terceira e quarta, o padrão muda: scrībam, scrībēs, scrībet e audiam, audiēs, audiet. Crās significa amanhã.',[
      ['Crās aquam portābō.','Amanhã carregarei água.'],
      ['Mīles templum vidēbit.','O soldado verá o templo.'],
      ['Iūlia crās scrībet.','Júlia escreverá amanhã.',['Amanhã Júlia escreverá.','Júlia vai escrever amanhã.','Amanhã Júlia vai escrever.']],
      ['Puella verba audiet.','A menina ouvirá as palavras.',['A menina vai ouvir as palavras.','A garota escutará as palavras.','A menina escutará as palavras.']]
    ],[['crās','amanhã'],['portābō','carregarei'],['scrībet','escreverá'],['audiet','ouvirá']],
    ['Qual futuro pertence ao verbo scrībere?',['scrībet','scrībēbat','scrīpsit'],'scrībet','O futuro da terceira conjugação usa -et na terceira pessoa do singular.'])
  ]},
  { id:'ix', numeral:'IX', title:'O arquivo da Legio', subtitle:'Voz passiva, orações relativas e leitura narrativa', lessons:[
    lesson('ix-1','Quem escreveu a carta?','Passiva no presente','Compare Iūlia epistulam scrībit (“Júlia escreve a carta”) com Epistula ā Iūliā scrībitur (“A carta é escrita por Júlia”). O objeto da ativa vira sujeito da passiva. O agente humano pode vir com ā ou ab mais ablativo.',[
      ['Epistula scrībitur.','A carta é escrita.'],
      ['Epistulae scrībuntur.','As cartas são escritas.'],
      ['Epistula ā Iūliā scrībitur.','A carta é escrita por Júlia.',['Júlia escreve a carta.','A carta é redigida por Júlia.']],
      ['Aqua ā mīlite portātur.','A água é carregada pelo soldado.',['O soldado carrega a água.','A água é transportada pelo soldado.']]
    ],[['scrībitur','é escrita'],['scrībuntur','são escritas'],['portātur','é carregada'],['ā mīlite','pelo soldado']],
    ['Quem pratica a ação em “ā Iūliā scrībitur”?',['Júlia','a carta','nenhum agente aparece'],'Júlia','Ā Iūliā é o agente da passiva. Epistula seria o sujeito que recebe a ação.']),
    lesson('ix-2','A pessoa que chegou','Pronome relativo','O relativo quī, quae, quod concorda com o antecedente em gênero e número. Seu caso depende do papel dentro da própria oração. Em puella quam videō, quam é acusativo porque é objeto de videō.',[
      ['Mīles quī venit amīcus est.','O soldado que vem é amigo.'],
      ['Puella quae cantat Iūlia est.','A menina que canta é Júlia.'],
      ['Puella quam videō cantat.','A menina que vejo canta.',['A menina que eu vejo canta.','A garota que vejo canta.','A garota que eu vejo canta.']],
      ['Librum quem portās videō.','Vejo o livro que você carrega.',['Eu vejo o livro que tu carregas.','Vejo o livro que tu carregas.','Eu vejo o livro que você carrega.']]
    ],[['quī','que (masculino, sujeito)'],['quae','que (feminino, sujeito)'],['quam','que (feminino, objeto)'],['quem','que (masculino, objeto)']],
    ['Por que quam está no acusativo em “puella quam videō”?',['É objeto de videō','É sujeito de videō','Indica posse'],'É objeto de videō','A menina é aquilo que eu vejo na oração relativa.']),
    lesson('ix-3','Antes do mensageiro','Mais-que-perfeito','O mais-que-perfeito apresenta uma ação anterior a outra já passada. Use o radical do perfeito mais -eram, -erās, -erat, -erāmus, -erātis, -erant. Scrīpserat pode ser “tinha escrito” ou “escrevera”.',[
      ['Iūlia epistulam scrīpserat.','Júlia tinha escrito uma carta.'],
      ['Mīles iam vēnerat.','O soldado já tinha chegado.'],
      ['Amīcī aquam portāverant.','Os amigos tinham carregado água.',['Os amigos haviam carregado água.','Os amigos tinham levado água.','Os amigos haviam levado água.','Os amigos carregaram água antes.']],
      ['Magistra verba audīverat.','A professora tinha ouvido as palavras.',['A professora havia ouvido as palavras.','A professora escutara as palavras.','A professora ouvira as palavras.']]
    ],[['iam','já'],['scrīpserat','tinha escrito'],['vēnerat','tinha chegado'],['portāverant','tinham carregado']],
    ['Qual forma indica “tinha escrito”?',['scrīpserat','scrīpsit','scrībēbat'],'scrīpserat','Scrīps- é o radical do perfeito, e -erat indica o mais-que-perfeito de terceira pessoa singular.']),
    lesson('ix-4','O relato do portão','Síntese de leitura','Divida a frase em orações. Primeiro localize os verbos. Depois marque o que já tinha ocorrido, o que estava em andamento e o que aconteceu. Em contexto, vēnit com ē longo é perfeito, enquanto venit com e breve é presente.',[
      ['Dum Iūlia scrībit, mīles venit.','Enquanto Júlia escreve, o soldado chega.'],
      ['Mīles quī herī vēnit epistulam portat.','O soldado que chegou ontem carrega uma carta.'],
      ['Ubi mīles vēnit, Iūlia iam scrīpserat.','Quando o soldado chegou, Júlia já tinha escrito.',['Júlia já tinha escrito quando o soldado chegou.','Quando o soldado chegou, Júlia já havia escrito.','Quando o soldado chegou, Júlia já escrevera.']],
      ['Epistula quam Iūlia scrīpsit in templō est.','A carta que Júlia escreveu está no templo.',['No templo está a carta que Júlia escreveu.']]
    ],[['dum','enquanto'],['ubi','quando (nesta frase)'],['vēnit','chegou'],['scrīpsit','escreveu']],
    ['Em “ubi mīles vēnit, Iūlia iam scrīpserat”, o que ocorreu primeiro?',['Júlia escreveu','O soldado chegou','Os dois ao mesmo tempo'],'Júlia escreveu','Scrīpserat coloca o ato de escrever antes do acontecimento narrado por vēnit.'])
  ]}
];
