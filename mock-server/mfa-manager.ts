export class MfaManager {
  private otpCodes: Map<string, { code: string; expiresAt: number }> =
    new Map();
  private readonly expiryMinutes = 5;

  generateOtp(userId: string): string {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = Date.now() + this.expiryMinutes * 60 * 1000;

    this.otpCodes.set(userId, { code: otp, expiresAt });

    console.log(
      `🔐 OTP for user ${userId}: ${otp} (expires in ${this.expiryMinutes} minutes)`
    );

    return otp;
  }

  validateOtp(userId: string, inputOtp: string): boolean {
    const storedData = this.otpCodes.get(userId);

    if (!storedData) {
      console.log(`No OTP found for user ${userId}`);
      return false;
    }

    if (Date.now() > storedData.expiresAt) {
      console.log(`OTP expired for user ${userId}`);
      this.otpCodes.delete(userId);
      return false;
    }

    const isValid = storedData.code === inputOtp;

    if (isValid) {
      console.log(`Valid OTP for user ${userId}`);
      this.otpCodes.delete(userId);
    } else {
      console.log(
        `Invalid OTP for user ${userId}. Expected: ${storedData.code}, Got: ${inputOtp}`
      );
    }

    return isValid;
  }

  clearOtp(userId: string): void {
    this.otpCodes.delete(userId);
  }

  getActiveOtps(): { userId: string; code: string; expiresAt: Date }[] {
    const active = [];
    for (const [userId, data] of this.otpCodes.entries()) {
      if (Date.now() <= data.expiresAt) {
        active.push({
          userId,
          code: data.code,
          expiresAt: new Date(data.expiresAt),
        });
      }
    }
    return active;
  }
}
