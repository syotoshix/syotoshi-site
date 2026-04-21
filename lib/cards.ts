export interface CardTheme {
  pri:  string
  prid: string
  prig: string
  bg:   string
  b0:   string
  b1:   string
  b2:   string
  b3:   string
}

export interface CardDef {
  id:      string
  name:    string
  tagline: string
  theme:   CardTheme
}

export const CARD_DEFS: CardDef[] = [
  {
    id:      'etherfi',
    name:    'ether.fi',
    tagline: 'Cash · Visa Infinite',
    theme: {
      pri:  '#a78bfa',
      prid: '#8b5cf6',
      prig: 'rgba(139,92,246,.13)',
      bg:   '#08050f',
      b0:   '#150d2a',
      b1:   '#1a1035',
      b2:   '#201340',
      b3:   '#28184f',
    },
  },
  {
    id:      'gnosispay',
    name:    'Gnosis Pay',
    tagline: 'Visa Debit · Gnosis Chain',
    theme: {
      pri:  '#00b87a',
      prid: '#009966',
      prig: 'rgba(0,184,122,.13)',
      bg:   '#010f08',
      b0:   '#052918',
      b1:   '#073320',
      b2:   '#093e27',
      b3:   '#0c4d30',
    },
  },
  {
    id:      'jupiter',
    name:    'Jupiter',
    tagline: 'Global Visa Infinite',
    theme: {
      pri:  '#00e6cf',
      prid: '#00c4ae',
      prig: 'rgba(0,230,207,.13)',
      bg:   '#020e14',
      b0:   '#0a2d42',
      b1:   '#0d3550',
      b2:   '#104060',
      b3:   '#154d70',
    },
  },
  {
    id:      'bleap',
    name:    'Bleap',
    tagline: 'Card · Visa',
    theme: {
      pri:  '#60a5fa',
      prid: '#3b82f6',
      prig: 'rgba(96,165,250,.13)',
      bg:   '#020814',
      b0:   '#071528',
      b1:   '#091a32',
      b2:   '#0c203d',
      b3:   '#0f274a',
    },
  },
  {
    id:      'metamask',
    name:    'MetaMask',
    tagline: 'Card · Mastercard',
    theme: {
      pri:  '#f6851b',
      prid: '#e07716',
      prig: 'rgba(246,133,27,.13)',
      bg:   '#0d0700',
      b0:   '#271400',
      b1:   '#301900',
      b2:   '#3d2000',
      b3:   '#4a2700',
    },
  },
]

// Jupiter is index 2 (center of 5)
export const JUPITER_INDEX = 2
