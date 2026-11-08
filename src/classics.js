// The Latin passages are public-domain originals. Portuguese translations and
// word-by-word notes are original to Legio Latina. Spellings follow the sources.
const paragraph = (translation, words) => ({
  translation,
  words:words.trim().split('\n').map(line=>{
    const [surface,lemma,general,context,role] = line.split('|');
    const word = surface.match(/[\p{L}\p{M}]+/u)[0];
    return {surface,word,lemma,general,context,role};
  })
});

export const classics = [
  {
    id:'seneca-tempus',title:'O tempo que escapa',author:'Sêneca',
    reference:'Epistulae morales ad Lucilium 1.1–2 (trecho)',
    source:'https://www.yorku.ca/pswarney/Texts/seneca/epistula/epistula-1.htm',
    intro:'A primeira carta a Lucílio trata o tempo como algo que se pode guardar, roubar ou deixar escapar. Observe a passagem das ordens no início para as perguntas do segundo parágrafo.',
    paragraphs:[
      paragraph('Faça assim, meu Lucílio: reivindique a si mesmo para si e recolha e guarde o tempo que até agora lhe era tirado, furtado ou escapava. Convença-se de que é como escrevo: parte do nosso tempo nos é arrancada, parte é levada às escondidas, parte se escoa. A perda mais vergonhosa, porém, é a que ocorre por negligência.',`
Ita|ita|assim, desse modo|assim|Advérbio que indica como agir.
fac,|faciō|fazer, produzir|faça|Imperativo singular, dirigido a Lucílio.
mi|meus|meu|meu|Vocativo masculino singular, acompanha Lucili.
Lucili;|Lucilius|Lucílio|Lucílio|Vocativo singular, nome de quem recebe a ordem.
vindica|vindicō|reivindicar, libertar|reivindique|Imperativo singular, introduz outra ordem.
te|tū|tu, você|a si mesmo|Acusativo singular, objeto de vindica.
tibi,|tū|tu, você|para si|Dativo singular de interesse, indica para quem reivindicar.
et|et|e, também|e|Liga a reivindicação às duas ordens sobre o tempo.
tempus,|tempus|tempo, ocasião|o tempo|Acusativo singular neutro, objeto de collige e serva.
quod|quī|que, o qual|que|Relativo neutro singular no nominativo, sujeito das três ações da oração relativa.
adhuc|adhūc|até agora, ainda|até agora|Advérbio de tempo que situa as perdas anteriores.
aut|aut|ou|ou|Primeiro membro de uma enumeração de três alternativas.
auferebatur|auferō|tirar, levar embora|era tirado|Imperfeito passivo, terceira pessoa singular. O tempo sofre a ação.
aut|aut|ou|ou|Introduz a segunda forma de perder tempo.
subripiebatur|subripiō|furtar, tirar às escondidas|era furtado|Imperfeito passivo, terceira pessoa singular. Distingue o furto da retirada evidente.
aut|aut|ou|ou|Introduz a terceira forma de perder tempo.
excidebat,|excidō|cair para fora, escapar|escapava|Imperfeito ativo, terceira pessoa singular. Aqui o tempo escapa por si.
collige|colligō|recolher, reunir|recolha|Imperativo singular. Retoma tempus após a oração relativa.
et|et|e|e|Liga os dois imperativos com o mesmo objeto.
serva.|servō|guardar, preservar|guarde|Imperativo singular. Seu objeto também é tempus.
Persuade|persuādeō|persuadir, convencer|convença|Imperativo singular. A pessoa convencida fica no dativo.
tibi|tū|tu, você|a si mesmo|Dativo singular, complemento de persuade.
hoc|hic|este, isto|isto|Acusativo neutro singular, sujeito de esse no discurso indireto.
sic|sīc|assim, dessa maneira|assim|Advérbio que prepara a comparação com ut scribo.
esse,|sum|ser, estar, existir|ser|Infinitivo presente. Hoc esse depende de persuade.
ut|ut|como, para que, de modo que|como|Conjunção comparativa que introduz scribo.
scribo:|scrībō|escrever|escrevo|Presente ativo, primeira pessoa singular. O sujeito é Sêneca.
quaedam|quīdam|certo, algum|parte de|Adjetivo indefinido neutro nominativo plural, acompanha tempora.
tempora|tempus|tempo, ocasião|nosso tempo|Nominativo neutro plural, sujeito de eripiuntur. Em português cabe o singular coletivo.
eripiuntur|ēripiō|arrancar, arrebatar|é arrancada|Presente passivo, terceira pessoa plural. A tradução usa singular por causa de “parte”.
nobis,|nōs|nós|de nós|Dativo plural, indica de quem o tempo é arrancado.
quaedam|quīdam|certo, algum|outra parte|Nominativo neutro plural. Tempora fica subentendido.
subducuntur,|subdūcō|retirar, subtrair|é levada às escondidas|Presente passivo, terceira pessoa plural, com tempora implícito.
quaedam|quīdam|certo, algum|outra parte|Nominativo neutro plural. Tempora fica subentendido novamente.
effluunt.|effluō|escoar, fluir para fora|se escoa|Presente ativo, terceira pessoa plural. O tempo se perde como líquido.
Turpissima|turpis|vergonhoso, desonroso|a mais vergonhosa|Superlativo feminino nominativo singular, predicativo de iactura.
tamen|tamen|porém, contudo|porém|Advérbio que destaca a perda mais grave.
est|sum|ser, estar, existir|é|Presente de terceira pessoa singular, liga iactura a turpissima.
iactura,|iactūra|perda, sacrifício|a perda|Nominativo feminino singular, sujeito de est e antecedente de quae.
quae|quī|que, o qual|que|Relativo feminino nominativo singular, sujeito de fit.
per|per|por, através de|por|Preposição com acusativo, aqui apresenta a causa.
neglegentiam|neglegentia|negligência, descuido|negligência|Acusativo feminino singular, regido por per.
fit.|fīō|tornar-se, acontecer, ser feito|ocorre|Presente, terceira pessoa singular, com sentido de acontecer.`),
      paragraph('E, se você quiser prestar atenção, a maior parte da vida escapa a quem age mal, grande parte a quem nada faz e a vida inteira a quem se ocupa de outra coisa. Quem você me apontará que dê algum valor ao tempo, que estime o dia, que entenda que morre a cada dia? Nisso, com efeito, nos enganamos: vemos a morte à nossa frente, mas grande parte dela já passou. A morte detém todo o tempo de vida que ficou para trás.',`
Et|et|e|e|Conjunção que liga a reflexão ao argumento anterior.
si|sī|se|se|Introduz a condição cujo verbo é volueris.
volueris|volō|querer|você quiser|Futuro perfeito ativo, segunda pessoa singular na condição.
attendere,|attendō|dirigir a atenção, observar|prestar atenção|Infinitivo que completa volueris.
maxima|maximus|máximo, o maior|a maior|Superlativo feminino nominativo singular, modifica pars.
pars|pars|parte, parcela|parte|Nominativo feminino singular, sujeito de elabitur.
vitae|vīta|vida|da vida|Genitivo feminino singular, identifica o todo de que pars é parte.
elabitur|ēlābor|escapar, deslizar|escapa|Presente de verbo depoente, forma passiva com sentido ativo.
male|male|mal|mal|Advérbio que modifica o primeiro agentibus.
agentibus,|agō|agir, fazer, conduzir|a quem age|Particípio presente no dativo plural, indica a quem a vida escapa.
magna|magnus|grande|grande parte|Feminino nominativo singular. Pars e elabitur ficam implícitos.
nihil|nihil|nada|nada|Acusativo neutro, objeto de agentibus.
agentibus,|agō|agir, fazer, conduzir|a quem faz|Particípio presente no dativo plural, segundo grupo a quem a vida escapa.
tota|tōtus|todo, inteiro|inteira|Feminino nominativo singular, modifica vita.
vita|vīta|vida|a vida|Nominativo feminino singular, sujeito de elabitur implícito.
aliud|alius|outro, diferente|outra coisa|Acusativo neutro singular, objeto de agentibus.
agentibus.|agō|agir, fazer, conduzir|a quem se ocupa|Particípio presente no dativo plural, terceiro grupo da enumeração.
Quem|quis|quem, qual|quem|Interrogativo masculino acusativo singular, objeto de dabis.
mihi|ego|eu|me|Dativo singular, destinatário da indicação.
dabis,|dō|dar, oferecer|você apontará|Futuro ativo, segunda pessoa singular. Dar aqui é apresentar um exemplo.
qui|quī|que, o qual|que|Relativo masculino nominativo singular, sujeito de ponat.
aliquod|aliquī|algum, certo|algum|Acusativo neutro singular, acompanha pretium.
pretium|pretium|preço, valor|valor|Acusativo neutro singular, objeto de ponat.
tempori|tempus|tempo, ocasião|ao tempo|Dativo neutro singular, indica a que se atribui valor.
ponat,|pōnō|pôr, colocar, estabelecer|dê|Presente do subjuntivo. Caracteriza a pessoa que se procura.
qui|quī|que, o qual|que|Relativo nominativo singular, sujeito de aestimet.
diem|diēs|dia|o dia|Acusativo masculino singular, objeto de aestimet.
aestimet,|aestimō|avaliar, estimar|estime|Presente do subjuntivo. Continua a caracterização da mesma pessoa.
qui|quī|que, o qual|que|Relativo nominativo singular, sujeito de intellegat.
intellegat|intellegō|entender, perceber|entenda|Presente do subjuntivo. Introduz a ideia expressa por se mori.
se|sē|se, a si mesmo|que ele próprio|Pronome reflexivo no acusativo, sujeito de mori em discurso indireto.
cotidie|cotīdiē|todos os dias, diariamente|a cada dia|Advérbio que modifica mori.
mori?|morior|morrer|morre|Infinitivo presente depoente, com se como sujeito.
In|in|em, para dentro de|em|Preposição com ablativo em in hoc.
hoc|hic|este, isto|isto|Ablativo neutro singular, retoma o ponto do engano explicado a seguir.
enim|enim|pois, com efeito|com efeito|Partícula explicativa, costuma vir depois do começo da frase.
fallimur,|fallō|enganar, iludir|nos enganamos|Presente passivo, primeira pessoa plural. Em português, cabe uma forma pronominal.
quod|quod|porque, o fato de que|ao pensar que|Conjunção que explica em que consiste o engano.
mortem|mors|morte|a morte|Acusativo feminino singular, objeto de prospicimus.
prospicimus;|prospiciō|olhar adiante, prever|vemos à nossa frente|Presente ativo, primeira pessoa plural.
magna|magnus|grande|grande|Nominativo feminino singular, concorda com pars.
pars|pars|parte, parcela|parte|Nominativo feminino singular, sujeito de praeterit.
eius|is|ele, ela, isso|dela|Genitivo singular, retoma a morte.
iam|iam|já, agora|já|Advérbio temporal que reforça a ideia de anterioridade.
praeterit.|praetereō|passar, ultrapassar|passou|Forma de praetereō, terceira pessoa singular. A tradução destaca o tempo já transcorrido.
Quicquid|quisquis|tudo que, qualquer coisa que|todo o tempo que|Relativo indefinido neutro. A expressão funciona como objeto de tenet.
aetatis|aetās|idade, tempo de vida|de vida|Genitivo singular partitivo, delimita quicquid.
retro|retrō|atrás, para trás|para trás|Advérbio que situa o tempo vivido no passado.
est,|sum|ser, estar, existir|ficou|Presente de terceira pessoa singular, verbo da oração relativa.
mors|mors|morte|a morte|Nominativo feminino singular, sujeito de tenet.
tenet.|teneō|segurar, deter, manter|detém|Presente ativo, terceira pessoa singular. O objeto é o tempo de vida passado.`)
    ]
  },
  {
    id:'seneca-vita',title:'A vida é curta?',author:'Sêneca',
    reference:'De brevitate vitae 1.3–4',
    source:'https://atlas.perseus.tufts.edu/library/passage/urn:cts:latinLit:stoa0255.stoa004.perseus-lat2:1.3-1.4/',
    intro:'Sêneca responde à queixa de que a vida é breve. No segundo parágrafo, ele compara nosso tempo a uma fortuna que cresce ou se dissipa conforme quem a administra.',
    paragraphs:[
      paragraph('Não temos pouco tempo, mas perdemos muito. A vida é bastante longa e nos foi dada com largueza para realizar grandes coisas, se fosse toda bem empregada. Mas, quando ela se escoa no luxo e no descuido, quando não se dedica a nada de bom, só quando a necessidade final aperta percebemos que passou aquela vida que nem notamos passar.',`
Non|nōn|não|não|Advérbio de negação que modifica habemus.
exiguum|exiguus|pequeno, escasso|pouco|Acusativo neutro substantivado, objeto de habemus.
temporis|tempus|tempo, ocasião|tempo|Genitivo partitivo, indica de que se tem pouco.
habemus,|habeō|ter, possuir|temos|Presente ativo, primeira pessoa plural.
sed|sed|mas|mas|Conjunção adversativa que contrapõe ter pouco a perder muito.
multum|multus|muito, numeroso|muito|Acusativo neutro substantivado, objeto de perdimus.
perdimus.|perdō|perder, destruir|perdemos|Presente ativo, primeira pessoa plural na edição adotada.
Satis|satis|bastante, suficientemente|bastante|Advérbio que indica o grau de longa.
longa|longus|longo, comprido|longa|Nominativo feminino singular, descreve vita.
vita|vīta|vida|a vida|Nominativo feminino singular, sujeito de data est. Pode-se suprir est com satis longa.
et|et|e, também|e|Conjunção que acrescenta a ideia de que a vida foi dada generosamente.
in|in|em, para|para|Com acusativo, indica a finalidade a que a vida se destina.
maximarum|maximus|o maior, muito grande|muito grandes|Genitivo feminino plural, concorda com rerum.
rerum|rēs|coisa, assunto, realização|coisas|Genitivo feminino plural, complemento de consummationem.
consummationem|consummātiō|realização, conclusão|realizar|Acusativo singular regido por in. A tradução transforma o substantivo em verbo.
large|largē|generosamente, em abundância|com largueza|Advérbio de modo que modifica data est.
data|dō|dar, conceder|dada|Particípio perfeito passivo, feminino nominativo singular. Concorda com vita.
est,|sum|ser, estar|foi|Auxiliar que forma com data o perfeito passivo.
si|sī|se|se|Conjunção que introduz a condição.
tota|tōtus|todo, inteiro|toda|Nominativo feminino singular, retoma vita.
bene|bene|bem|bem|Advérbio que qualifica o modo de empregar a vida.
collocaretur;|collocō|colocar, aplicar, investir|fosse empregada|Imperfeito do subjuntivo passivo, terceira pessoa singular.
sed|sed|mas|mas|Conjunção que contrapõe o cenário de desperdício ao de bom uso.
ubi|ubi|onde, quando|quando|Conjunção temporal, introduz diffluit.
per|per|por, através de|por|Preposição que rege luxum e também neglegentiam.
luxum|luxus|luxo, excesso|luxo|Acusativo singular, primeiro complemento de per.
ac|atque|e, e também|e|Conjunção que coordena luxum e neglegentiam.
neglegentiam|neglegentia|negligência, descuido|descuido|Acusativo singular, segundo complemento de per.
diffluit,|diffluō|escoar, dissipar-se|se escoa|Presente ativo, terceira pessoa singular. Vita é o sujeito implícito.
ubi|ubi|onde, quando|quando|Conjunção temporal que introduz a segunda circunstância.
nulli|nūllus|nenhum|a nenhuma|Dativo feminino singular, concorda com rei.
bonae|bonus|bom, útil|boa|Dativo feminino singular, também concorda com rei.
rei|rēs|coisa, assunto|coisa|Dativo singular, indica a que a vida não é dedicada.
impenditur,|impendō|empregar, gastar, dedicar|é dedicada|Presente passivo, terceira pessoa singular. O sujeito continua sendo vita.
ultima|ultimus|último, final|final|Ablativo feminino singular, modifica necessitate.
demum|dēmum|finalmente, somente então|só então|Advérbio que marca o momento tardio da percepção.
necessitate|necessitās|necessidade, constrangimento|a necessidade|Ablativo feminino singular, sujeito do particípio cogente em construção independente.
cogente|cōgō|forçar, compelir, reunir|apertando|Particípio presente no ablativo, concorda com necessitate. Juntos indicam a circunstância.
quam|quī|que, o qual|aquela vida que|Relativo feminino acusativo singular, retoma vita e é sujeito do infinitivo ire.
ire|eō|ir, caminhar|passar|Infinitivo presente dependente de intelleximus.
non|nōn|não|nem|Negação de intelleximus.
intelleximus|intellegō|entender, perceber|notamos|Perfeito ativo, primeira pessoa plural.
transisse|trānseō|atravessar, passar|que passou|Infinitivo perfeito dependente de sentimus. Refere-se à vida já transcorrida.
sentimus.|sentiō|sentir, perceber|percebemos|Presente ativo, primeira pessoa plural, verbo principal do período.`),
      paragraph('É assim: não recebemos uma vida breve, nós a tornamos breve. Não somos carentes dela, mas esbanjadores. Assim como fortunas amplas, dignas de reis, se dissipam num instante quando caem nas mãos de um mau dono, ao passo que fortunas modestas crescem com o uso quando são confiadas a um bom guardião, assim também nossa vida oferece muito a quem sabe administrá-la.',`
Ita|ita|assim, desse modo|assim|Advérbio que confirma o argumento anterior.
est:|sum|ser, estar|é|Presente de terceira pessoa singular.
non|nōn|não|não|Nega o verbo accipimus.
accipimus|accipiō|receber, aceitar|recebemos|Presente ativo, primeira pessoa plural.
brevem|brevis|breve, curto|breve|Acusativo feminino singular, modifica vitam.
vitam,|vīta|vida|uma vida|Acusativo feminino singular, objeto de accipimus.
sed|sed|mas|mas|Contrapõe a condição recebida à que nós produzimos.
facimus,|faciō|fazer, produzir|nós a tornamos breve|Presente ativo, primeira pessoa plural. Vitam e brevem são retomados implicitamente.
nec|neque|e não, nem|não|Conjunção negativa que continua o contraste.
inopes|inops|pobre, carente de|carentes|Nominativo plural, predicativo de um “nós” implícito.
eius|is|ele, ela, isso|dela|Genitivo singular regido por inopes, retoma vitam.
sed|sed|mas|mas|Introduz o segundo predicativo, prodigi.
prodigi|prodigus|pródigo, esbanjador|esbanjadores|Nominativo masculino plural, segundo predicativo do sujeito implícito.
sumus.|sum|ser, estar|somos|Presente, primeira pessoa plural. Liga o sujeito aos predicativos.
Sicut|sīcut|assim como|assim como|Abre uma comparação retomada por ita.
amplae|amplus|amplo, abundante|amplas|Nominativo feminino plural, concorda com opes.
et|et|e, também|e|Liga amplae e regiae.
regiae|rēgius|real, digno de um rei|dignas de reis|Nominativo feminino plural, também concorda com opes.
opes,|ops|recursos, riqueza, poder|fortunas|Nominativo feminino plural, sujeito de dissipantur.
ubi|ubi|onde, quando|quando|Abre a oração temporal de pervenerunt.
ad|ad|a, para, em direção a|às mãos de|Preposição com acusativo, indica a quem chegam as riquezas.
malum|malus|mau, ruim|mau|Acusativo masculino singular, modifica dominum.
dominum|dominus|dono, senhor|dono|Acusativo masculino singular, regido por ad.
pervenerunt,|perveniō|chegar, atingir|caem|Perfeito ativo, terceira pessoa plural, com opes como sujeito.
momento|mōmentum|movimento, instante|num instante|Ablativo singular de tempo.
dissipantur,|dissipō|dispersar, dissipar|se dissipam|Presente passivo, terceira pessoa plural. Opes é sujeito.
at|at|mas, ao passo que|ao passo que|Conjunção que opõe os dois destinos da fortuna.
quamvis|quamvīs|embora, por mais que|mesmo que sejam|Advérbio de concessão, introduz modicae com um verbo implícito.
modicae,|modicus|moderado, pequeno|modestas|Nominativo feminino plural. O substantivo opes fica implícito.
si|sī|se|quando|Conjunção condicional, aqui traduzida pela circunstância em que a riqueza cresce.
bono|bonus|bom, capaz|bom|Dativo masculino singular, modifica custodi.
custodi|custōs|guardião, protetor|a um guardião|Dativo masculino singular, destinatário da entrega.
traditae|trādō|entregar, confiar|confiadas|Particípio perfeito passivo, nominativo feminino plural. Concorda com opes.
sunt,|sum|ser, estar|são|Auxiliar de traditae. Juntos formam o perfeito passivo, vertido como presente para expressar uma regra geral.
usu|ūsus|uso, prática|com o uso|Ablativo singular de meio.
crescunt;|crēscō|crescer, aumentar|crescem|Presente ativo, terceira pessoa plural. O sujeito é opes.
ita|ita|assim, desse modo|assim também|Advérbio que introduz o segundo termo da comparação com sicut.
aetas|aetās|idade, tempo de vida|a vida|Nominativo feminino singular, sujeito de patet.
nostra|noster|nosso|nossa|Possessivo feminino nominativo singular, concorda com aetas.
bene|bene|bem|bem|Advérbio que modifica disponenti.
disponenti|dispōnō|dispor, organizar, administrar|a quem sabe administrá-la|Particípio presente substantivado no dativo singular, indica a quem a vida oferece espaço.
multum|multus|muito, numeroso|muito|Acusativo neutro de valor adverbial, indica a extensão de patet.
patet.|pateō|estar aberto, estender-se|oferece muito espaço|Presente ativo, terceira pessoa singular. Aetas é o sujeito.`)
    ]
  }
];
