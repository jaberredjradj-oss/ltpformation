export interface PreinscriptionSheetData {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  formationTitle: string;
  sessionLabel: string;
  submittedAtLabel: string;
  statusLabel: string;
  reservedSeatsLabel: string;
  cpfFinancing: string | null;
  observations: string | null;
  sessionDetails: string | null;
  reference: string;
}
