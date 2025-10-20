export interface Contact {
  id: string;

  // REMOVA ou COMENTE estes campos antigos:
  // name: string;
  // email: string;
  // subject: string;
  // message: string;
  // isRead: boolean;
  // isReplied: boolean;
  // readAt?: string;
  // receivedAt: string;

  // ADICIONE estes novos campos:
  title: string;           // Ex: "Telefone Principal", "WhatsApp Comercial"
  phoneNumber: string;     // Número formatado: (11) 99999-9999
  description: string;     // Descrição: "Atendimento ao cliente"
  pageLocation: string;    // Onde aparece: "header", "footer", "contato", "sobre"
  isActive: boolean;       // Se está visível no site
  category: string;        // "comercial", "suporte", "emergencia", "whatsapp"
  order: number;           // Ordem de exibição
  createdAt: string;
  updatedAt: string;
}
