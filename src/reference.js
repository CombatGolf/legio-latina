// Paradigmas de consulta para as formas ensinadas na campanha.
export const declensions = [
  {title:'1ª declinação · puella',note:'Modelo feminino; o genitivo singular identifica a declinação: puellae.',rows:[
    ['Nominativo','puella','puellae'],['Vocativo','puella','puellae'],['Genitivo','puellae','puellārum'],['Dativo','puellae','puellīs'],['Acusativo','puellam','puellās'],['Ablativo','puellā','puellīs']]},
  {title:'2ª declinação masculina · amīcus',note:'O vocativo singular dos nomes em -us costuma terminar em -e.',rows:[
    ['Nominativo','amīcus','amīcī'],['Vocativo','amīce','amīcī'],['Genitivo','amīcī','amīcōrum'],['Dativo','amīcō','amīcīs'],['Acusativo','amīcum','amīcōs'],['Ablativo','amīcō','amīcīs']]},
  {title:'2ª declinação neutra · templum',note:'Em todos os neutros, nominativo e acusativo são iguais.',rows:[
    ['Nominativo','templum','templa'],['Vocativo','templum','templa'],['Genitivo','templī','templōrum'],['Dativo','templō','templīs'],['Acusativo','templum','templa'],['Ablativo','templō','templīs']]},
  {title:'3ª declinação · rēx',note:'O genitivo rēgis revela o radical rēg-. Há outros padrões na 3ª declinação.',rows:[
    ['Nominativo','rēx','rēgēs'],['Vocativo','rēx','rēgēs'],['Genitivo','rēgis','rēgum'],['Dativo','rēgī','rēgibus'],['Acusativo','rēgem','rēgēs'],['Ablativo','rēge','rēgibus']]},
  {title:'4ª declinação · manus',note:'Manus é feminino. Manūs pode ser genitivo singular ou nominativo, vocativo e acusativo plurais.',rows:[
    ['Nominativo','manus','manūs'],['Vocativo','manus','manūs'],['Genitivo','manūs','manuum'],
    ['Dativo','manuī','manibus'],['Acusativo','manum','manūs'],['Ablativo','manū','manibus']]},
  {title:'5ª declinação · rēs',note:'Rēs é feminino. Dativo e ablativo plurais terminam em -ēbus.',rows:[
    ['Nominativo','rēs','rēs'],['Vocativo','rēs','rēs'],['Genitivo','reī','rērum'],
    ['Dativo','reī','rēbus'],['Acusativo','rem','rēs'],['Ablativo','rē','rēbus']]}
];
export const conjugations = [
  ['eu','sum','amō','videō'],['tu','es','amās','vidēs'],['ele/ela','est','amat','videt'],['nós','sumus','amāmus','vidēmus'],['vós','estis','amātis','vidētis'],['eles/elas','sunt','amant','vident']
];

export const verbTenses = [
  ['eu','scrībō','scrībēbam','scrīpsī','scrībam'],
  ['tu','scrībis','scrībēbās','scrīpsistī','scrībēs'],
  ['ele/ela','scrībit','scrībēbat','scrīpsit','scrībet'],
  ['nós','scrībimus','scrībēbāmus','scrīpsimus','scrībēmus'],
  ['vós','scrībitis','scrībēbātis','scrīpsistis','scrībētis'],
  ['eles/elas','scrībunt','scrībēbant','scrīpsērunt','scrībent']
];
