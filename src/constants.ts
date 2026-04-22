import { Service } from './types';

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  items: string[];
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'fiscale',
    title: 'Dichiarazioni dei Redditi (Fiscale)',
    iconName: 'FileText',
    description: 'Assistenza completa per la tua situazione fiscale e dichiarativa.',
    items: [
      'Modello 730: Compilazione e invio telematico',
      'Modello Redditi PF (ex Unico): Per chi non può utilizzare il 730',
      'Modello RED: Dichiarazione dei redditi per pensionati INPS',
      'Calcolo imposte e F24: IRPEF, addizionali e predisposizione pagamenti',
      'Visto di conformità: Garanzia di correttezza dei dati nel 730'
    ]
  },
  {
    id: 'agevolazioni',
    title: 'Situazione Economica e ISEE',
    iconName: 'Calculator',
    description: 'Accesso a bonus, agevolazioni e prestazioni sociali.',
    items: [
      'Calcolo ISEE: Ordinario, corrente, universitari',
      'DSU (Dichiarazione Sostitutiva Unica): Per bonus e prestazioni',
      'Bonus Sociali: Energia, gas e acqua',
      'Assegno Unico e Universale: Per figli a carico',
      'Bonus vari: Bebè, nido, assegni di maternità'
    ]
  },
  {
    id: 'immobiliare',
    title: 'Casa e Immobiliare',
    iconName: 'Home',
    description: 'Gestione tributi locali, contratti e pratiche catastali.',
    items: [
      'IMU/TASI: Calcolo e compilazione modelli F24',
      'Visure Catastali: Consultazione ipocatastale',
      'Volture: Pratiche di voltura catastale',
      'Contratti di affitto: Registrazione, risoluzione e proroga',
      'Cedolare secca: Opzione per tassazione agevolata'
    ]
  },
  {
    id: 'lavoro-domestico',
    title: 'Colf, Badanti e Lavoro Domestico',
    iconName: 'Users',
    description: 'Assistenza completa per la gestione dei collaboratori domestici.',
    items: [
      'Assunzioni: Definizione del contratto di lavoro',
      'Buste paga: Elaborazione mensile dei cedolini',
      'Contributi INPS: Generazione MAV per versamenti',
      'Modello CU: Certificazione Unica per colf/badanti'
    ]
  },
  {
    id: 'altri',
    title: 'Altri Servizi e Pratiche',
    iconName: 'PlusCircle',
    description: 'Successioni, identità digitale e pratiche varie.',
    items: [
      'Successioni: Dichiarazione e pratiche collegate',
      'Spid e Firma Digitale: Rilascio credenziali digitali',
      'Visure camerali: Per aziende',
      'Invio telematico: Atti all\'Agenzia delle Entrate'
    ]
  },
  {
    id: 'stranieri-extra',
    title: 'Servizi per Stranieri',
    iconName: 'Globe',
    description: 'Supporto dedicato per permessi, cittadinanza e ricongiungimenti.',
    items: [
      'Permessi di Soggiorno: Rinnovo e aggiornamento',
      'Cittadinanza: Assistenza domande',
      'Ricongiungimenti Familiari',
      'Supporto Multilingue (AR, ENG, FR, ES)'
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: '730',
    title: '730 & Dichiarazione Redditi',
    description: 'Assistenza completa per la tua dichiarazione dei redditi. Semplice, veloce e senza errori.',
    iconName: 'FileText',
    documents: [
      'Documento d\'identità e Codice Fiscale',
      'Certificazione Unica (CU)',
      'Scontrini farmacia e spese mediche',
      'Certificati interessi passivi mutuo',
      'Spese veterinarie, scolastiche o funebri'
    ],
    price: 'A partire da €30',
    color: 'bg-blue-500'
  },
  {
    id: 'isee',
    title: 'ISEE & Agevolazioni',
    description: 'Calcolo ISEE per accedere a bonus nido, assegno unico, bonus bollette e università.',
    iconName: 'Calculator',
    documents: [
      'DSU firmata',
      'Saldi e giacenze medie conti correnti al 31/12/2024',
      'Targhe autoveicoli e motoveicoli',
      'Visure catastali immobili di proprietà'
    ],
    price: 'Gratuito / Tariffe agevolate',
    color: 'bg-green-500'
  },
  {
    id: 'stranieri',
    title: 'Pratiche per Stranieri',
    description: 'Permessi di soggiorno, cittadinanza, ricongiungimenti familiari e traduzioni documenti.',
    iconName: 'Globe',
    documents: [
      'Passaporto in corso di validità',
      'Permesso di soggiorno scaduto o in scadenza',
      'Contratto di soggiorno o lavoro',
      'Certificato di idoneità alloggiativa'
    ],
    color: 'bg-amber-500'
  },
  {
    id: 'pensioni',
    title: 'Pensioni & Patronato',
    description: 'Verifica contributiva, domande di pensione di vecchiaia, anticipata o invalidità.',
    iconName: 'HeartHandshake',
    documents: [
      'Estratto conto contributivo INPS',
      'Copia documento d\'identità',
      'Dati coordinati bancari (IBAN)'
    ],
    color: 'bg-red-500'
  },
  {
    id: 'bonus',
    title: 'Bonus & Supporto Famiglia',
    description: 'Richiesta bonus asilo nido, assegno unico universale e altre misure di sostegno.',
    iconName: 'Baby',
    documents: [
      'Documenti genitori e figli',
      'Codice IBAN per accreditamento',
      'Modello ISEE in corso di validità'
    ],
    color: 'bg-purple-500'
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Marco Rossi',
    text: 'Servizio impeccabile e veloce. Ho fatto il 730 in meno di 20 minuti senza alcuno stress.',
    role: 'Privato',
    rating: 5
  },
  {
    id: '2',
    name: 'Ahmed K.',
    text: 'Mi hanno aiutato con il rinnovo del permesso di soggiorno. Molto gentili e preparati in diverse lingue.',
    role: 'Lavoratore Straniero',
    rating: 5
  },
  {
    id: '3',
    name: 'Elena Valenti',
    text: 'Prezzi onesti e massima professionalità. Mi hanno seguito passo passo per l\'ISEE universitario di mia figlia.',
    role: 'Madre di famiglia',
    rating: 5
  },
  {
    id: '4',
    name: 'Luca Bianchi',
    text: 'Il miglior CAF di Milano Nord. Studio pulito, personale accogliente e pratiche evase in tempi record.',
    role: 'Imprenditore',
    rating: 5
  },
  {
    id: '5',
    name: 'Sara J.',
    text: 'Professionisti seri che sanno come gestire pratiche complesse come le successioni. Molto soddisfatta.',
    role: 'Cliente Fedele',
    rating: 4
  }
];
