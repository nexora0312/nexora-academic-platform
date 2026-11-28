export class EmailService {
  send(): Promise<void> {
    return Promise.reject(new Error("Email delivery is not configured."));
  }
}
