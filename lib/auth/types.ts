export type AdminRole = "admin" | "editor";

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
  demo: boolean;
}
