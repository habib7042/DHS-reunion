
export interface StudentData {
  fullName: string;
  sscYear: number;
  mobile: string;
  email?: string;
  occupation: string;
  presentAddress: string;
  permanentAddress: string;
  isVolunteer: boolean;
}

export interface TicketData {
  type: 'single' | 'couple' | 'family';
  price: number;
  guests: number;
  ticketId: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  fee: number;
  total: number;
  transactionId?: string;
  senderNumber?: string;
  timestamp: string;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface Registration {
  id: string; // unique ID based on timestamp or random
  student: StudentData;
  ticket: TicketData;
  payment: PaymentDetails;
  status: RegistrationStatus;
  submissionDate: string;
}

export type AppView = 'home' | 'register' | 'booking' | 'payment' | 'id-card' | 'schedule' | 'admin-login' | 'admin-dashboard' | 'check-status' | 'pending-success';

export interface NostalgiaContent {
  fact: string;
  song: string;
  movie: string;
}
