import { Service } from './types';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  items: ServiceItem[];
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'fiscale',
    title: 'Dichiarazioni dei Redditi (Fiscale)',
    iconName: 'FileText',
    description: 'Assistenza completa per la tua situazione fiscale e dichiarativa.',
    items: [
      { id: '730_base', name: 'Modello 730 Base', price: 30 },
      { id: '730_completo', name: 'Modello 730 con Visto', price: 50 },
      { id: 'unico_pf', name: 'Modello Redditi PF', price: 80 },
      { id: 'red_inps', name: 'Modello RED Pensionati', price: 20 }
    ]
  },
  {
    id: 'agevolazioni',
    title: 'Situazione Economica e ISEE',
    iconName: 'Calculator',
    description: 'Accesso a bonus, agevolazioni e prestazioni sociali.',
    items: [
      { id: 'isee_ordinario', name: 'Calcolo ISEE Ordinario', price: 0 },
      { id: 'isee_universitario', name: 'ISEE Universitario', price: 15 },
      { id: 'assegno_unico', name: 'Pratica Assegno Unico', price: 25 },
      { id: 'bonus_bollette', name: 'Richiesta Bonus Sociali', price: 10 }
    ]
  },
  {
    id: 'immobiliare',
    title: 'Casa e Immobiliare',
    iconName: 'Home',
    description: 'Gestione tributi locali, contratti e pratiche catastali.',
    items: [
      { id: 'imu_tasi', name: 'Calcolo IMU/TASI', price: 20 },
      { id: 'contratto_affitto', name: 'Registrazione Contratto', price: 60 },
      { id: 'visura_catastale', name: 'Visura Catastale', price: 15 }
    ]
  },
  {
    id: 'lavoro-domestico',
    title: 'Colf, Badanti e Lavoro Domestico',
    iconName: 'Users',
    description: 'Assistenza completa per la gestione dei collaboratori domestici.',
    items: [
      { id: 'assunzione_colf', name: 'Contratto Assunzione', price: 50 },
      { id: 'busta_paga', name: 'Elaborazione Busta Paga', price: 15 },
      { id: 'mav_inps', name: 'Generazione MAV INPS', price: 10 }
    ]
  },
  {
    id: 'altri',
    title: 'Altri Servizi e Pratiche',
    iconName: 'PlusCircle',
    description: 'Successioni, identità digitale e pratiche varie.',
    items: [
      { id: 'spid_rilascio', name: 'Rilascio SPID Personale', price: 15 },
      { id: 'firma_digitale', name: 'Firma Digitale Remota', price: 40 },
      { id: 'successione_base', name: 'Consulenza Successione', price: 100 }
    ]
  },
  {
    id: 'viaggi',
    title: 'Viaggi e Biglietteria',
    iconName: 'Plane',
    description: 'Prenotazione biglietti aerei e assistenza viaggi.',
    items: [
      { id: 'volo_prenotazione', name: 'Prenotazione Volo', price: 10 },
      { id: 'visto_consulenza', name: 'Consulenza Visto', price: 30 },
      { id: 'assicurazione_viaggio', name: 'Assicurazione Viaggio', price: 15 }
    ]
  },
  {
    id: 'stranieri-extra',
    title: 'Servizi per Stranieri',
    iconName: 'Globe',
    description: 'Supporto per permessi e fiscalità internazionale.',
    items: [
      { id: 'rinnovo_permesso', name: 'Rinnovo Permesso', price: 40 },
      { id: 'cittadinanza_assistenza', name: 'Domanda Cittadinanza', price: 150 },
      { id: 'consulenza_aire', name: 'Consulenza AIRE', price: 50 }
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
  },
  {
    id: 'viaggi',
    title: 'Biglietti Aerei & Viaggi',
    description: 'Prenotazione biglietti aerei nazionali e internazionali con le migliori tariffe.',
    iconName: 'Plane',
    documents: [
      'Documento d\'identità o Passaporto',
      'Date e destinazione del viaggio'
    ],
    price: 'Tariffe competitive',
    color: 'bg-indigo-500'
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
