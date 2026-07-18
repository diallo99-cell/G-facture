export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  status: string;
  clientId: string;
  items: InvoiceItem[];
  discount: number;
}

export const mockClients: Client[] = [
  { id: "C-001", name: "Amadou Diallo", email: "amadou@diallo.com", phone: "+224 622 00 11 22", address: "Kaloum, Conakry", avatar: "47" },
  { id: "C-002", name: "Fatoumata Barry", email: "fatou@barry.com", phone: "+224 620 55 44 33", address: "Dixinn, Conakry", avatar: "12" },
  { id: "C-003", name: "Ousmane Sylla", email: "ousmane@sylla.com", phone: "+224 664 12 34 56", address: "Ratoma, Conakry", avatar: "33" },
  { id: "C-004", name: "Mamadou Sow", email: "mamadou@sow.com", phone: "+224 621 98 76 54", address: "Matoto, Conakry", avatar: "68" },
  { id: "C-005", name: "Aissatou Bah", email: "aissa@bah.com", phone: "+224 623 45 67 89", address: "Matam, Conakry", avatar: "25" },
  { id: "C-006", name: "Ibrahima Keita", email: "ibrahima@keita.com", phone: "+224 622 11 22 33", address: "Coyah", avatar: "59" },
  { id: "C-007", name: "Binta Camara", email: "binta@camara.com", phone: "+224 664 99 88 77", address: "Dubréka", avatar: "42" },
];

export const mockInvoices: Invoice[] = [
  {
    id: "FAC-2026-001",
    date: "2026-01-18",
    dueDate: "2026-02-18",
    status: "payée",
    clientId: "C-001",
    items: [
      { id: "1", description: "Design de site web", quantity: 1, unitPrice: 15000000 },
      { id: "2", description: "Hébergement annuel", quantity: 1, unitPrice: 2000000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-002",
    date: "2026-01-18",
    dueDate: "2026-02-18",
    status: "brouillon",
    clientId: "C-002",
    items: [
      { id: "1", description: "Consulting IT", quantity: 10, unitPrice: 500000 }
    ],
    discount: 500000
  },
  {
    id: "FAC-2026-003",
    date: "2026-01-18",
    dueDate: "2026-01-25",
    status: "envoyée",
    clientId: "C-003",
    items: [
      { id: "1", description: "Maintenance réseau", quantity: 1, unitPrice: 3500000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-004",
    date: "2026-01-15",
    dueDate: "2026-02-15",
    status: "payée",
    clientId: "C-004",
    items: [
      { id: "1", description: "Audit de sécurité", quantity: 1, unitPrice: 8000000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-005",
    date: "2026-01-10",
    dueDate: "2026-01-20",
    status: "en retard",
    clientId: "C-005",
    items: [
      { id: "1", description: "Création de logo", quantity: 1, unitPrice: 1500000 },
      { id: "2", description: "Charte graphique", quantity: 1, unitPrice: 2500000 }
    ],
    discount: 200000
  },
  {
    id: "FAC-2026-006",
    date: "2026-01-05",
    dueDate: "2026-02-05",
    status: "envoyée",
    clientId: "C-006",
    items: [
      { id: "1", description: "Campagne Marketing", quantity: 1, unitPrice: 6000000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-007",
    date: "2026-01-02",
    dueDate: "2026-01-15",
    status: "payée",
    clientId: "C-007",
    items: [
      { id: "1", description: "Consultation fiscale", quantity: 3, unitPrice: 800000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-008",
    date: "2025-12-28",
    dueDate: "2026-01-28",
    status: "brouillon",
    clientId: "C-001",
    items: [
      { id: "1", description: "Développement mobile", quantity: 1, unitPrice: 25000000 }
    ],
    discount: 5000000
  },
  {
    id: "FAC-2026-009",
    date: "2025-12-20",
    dueDate: "2026-01-20",
    status: "en retard",
    clientId: "C-002",
    items: [
      { id: "1", description: "Support technique annuel", quantity: 1, unitPrice: 12000000 }
    ],
    discount: 0
  },
  {
    id: "FAC-2026-010",
    date: "2025-12-15",
    dueDate: "2026-01-15",
    status: "payée",
    clientId: "C-003",
    items: [
      { id: "1", description: "Configuration serveurs", quantity: 5, unitPrice: 1500000 }
    ],
    discount: 500000
  },
];

export function calculateInvoiceTotals(items: InvoiceItem[], discount: number) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.18; // 18% TVA
  const total = subtotal + tax - discount;
  
  return {
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    discount: Math.round(discount),
    total: Math.round(total)
  };
}
