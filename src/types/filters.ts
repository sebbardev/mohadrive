// Types pour le système de filtres adaptatifs

export interface FilterOption {
  readonly label: string;
  readonly value: string;
  count?: number;
  color?: string;
}

export interface SearchFilter {
  type: 'search';
  placeholder: string;
  fields: string[]; // Champs à rechercher
  value?: string;
}

export interface TabFilter {
  type: 'tab';
  options: readonly FilterOption[];
  value?: string;
  multiSelect?: boolean;
}

export interface DropdownFilter {
  type: 'dropdown';
  placeholder: string;
  options: readonly FilterOption[];
  value?: string;
  multiSelect?: boolean;
  searchable?: boolean;
}

export interface DateRangeFilter {
  type: 'dateRange';
  fromPlaceholder?: string;
  toPlaceholder?: string;
  value?: { from: string; to: string };
}

export interface SortFilter {
  type: 'sort';
  options: readonly FilterOption[];
  value?: string;
  defaultOrder?: 'asc' | 'desc';
}

export type FilterConfig = SearchFilter | TabFilter | DropdownFilter | DateRangeFilter | SortFilter;

export interface AdaptiveFilterConfig {
  id: string;
  title: string;
  filters: readonly FilterConfig[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showReset?: boolean;
  showSearch?: boolean;
  autoApply?: boolean;
}

export interface FilterState {
  [key: string]: any;
}

export interface FilterResults<T> {
  data: T[];
  total: number;
  filteredCount: number;
  hasFilters: boolean;
}

// Configurations prédéfinies pour chaque vue
export const VIEW_FILTER_CONFIGS = {
  notifications: {
    id: 'notifications',
    title: 'Filtrer les notifications',
    filters: [
      {
        type: 'tab' as const,
        options: [
          { label: 'Toutes', value: 'all' },
          { label: 'Non lues', value: 'unread' },
          { label: 'Lues', value: 'read' }
        ]
      }
    ],
    autoApply: true
  },
  
  customers: {
    id: 'customers',
    title: 'Filtrer les clients',
    filters: [
      {
        type: 'search' as const,
        placeholder: 'Rechercher un client...',
        fields: ['first_name', 'last_name', 'email', 'phone']
      }
    ],
    showSearch: true,
    autoApply: true
  },

  reservations: {
    id: 'reservations',
    title: 'Filtrer les réservations',
    filters: [
      {
        type: 'search' as const,
        placeholder: 'Rechercher par nom, véhicule...',
        fields: ['firstName', 'lastName', 'car.brand', 'car.model']
      },
      {
        type: 'sort' as const,
        options: [
          { label: 'Date de création', value: 'created_at' },
          { label: 'Date de début', value: 'start_date' },
          { label: 'Statut', value: 'status' }
        ],
        defaultOrder: 'desc'
      }
    ],
    showSearch: true,
    autoApply: true
  },

  messages: {
    id: 'messages',
    title: 'Filtrer les messages',
    filters: [
      {
        type: 'search' as const,
        placeholder: 'Rechercher par nom, email, sujet...',
        fields: ['name', 'email', 'subject']
      },
      {
        type: 'tab' as const,
        options: [
          { label: 'Tous', value: 'all' },
          { label: 'Non lus', value: 'unread' },
          { label: 'Lus', value: 'read' }
        ]
      },
      {
        type: 'sort' as const,
        options: [
          { label: 'Date', value: 'created_at' },
          { label: 'Nom', value: 'name' }
        ],
        defaultOrder: 'desc'
      }
    ],
    showSearch: true,
    autoApply: true
  },

  reviews: {
    id: 'reviews',
    title: 'Filtrer les avis',
    filters: [
      {
        type: 'search' as const,
        placeholder: 'Rechercher par nom, email, commentaire...',
        fields: ['customer_name', 'customer_email', 'comment']
      },
      {
        type: 'tab' as const,
        options: [
          { label: 'Tous', value: 'all' },
          { label: 'Approuvés', value: 'approved' },
          { label: 'En attente', value: 'pending' }
        ]
      },
      {
        type: 'sort' as const,
        options: [
          { label: 'Date', value: 'created_at' },
          { label: 'Note', value: 'rating' }
        ],
        defaultOrder: 'desc'
      }
    ],
    showSearch: true,
    autoApply: true
  },

  expenses: {
    id: 'expenses',
    title: 'Filtrer les dépenses',
    filters: [
      {
        type: 'search' as const,
        placeholder: 'Rechercher une dépense...',
        fields: ['note', 'type', 'car.brand', 'car.model']
      },
      {
        type: 'dropdown' as const,
        placeholder: 'Véhicule',
        options: [], // Sera rempli dynamiquement
        searchable: true
      },
      {
        type: 'dropdown' as const,
        placeholder: 'Type de dépense',
        options: [
          { label: 'Carburant', value: 'carburant' },
          { label: 'Entretien', value: 'entretien' },
          { label: 'Lavage', value: 'lavage' },
          { label: 'Assurance', value: 'assurance' },
          { label: 'Vignette', value: 'vignette' },
          { label: 'Réparation', value: 'réparation' },
          { label: 'Crédit', value: 'crédit' }
        ]
      },
      {
        type: 'dateRange' as const,
        fromPlaceholder: 'Date début',
        toPlaceholder: 'Date fin'
      }
    ],
    showSearch: true,
    autoApply: true
  }
} as const;

export type ViewFilterKey = keyof typeof VIEW_FILTER_CONFIGS;
