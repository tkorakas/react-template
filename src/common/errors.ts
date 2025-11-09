export class MfaRequiredError extends Error {
  constructor(message = 'MFA verification required') {
    super(message);
    this.name = 'MfaRequiredError';
  }
}
