export interface IMailService {
  sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
}
