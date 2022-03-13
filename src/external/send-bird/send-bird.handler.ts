export class SendBirdHandler {
  private readonly applicationId: string;

  constructor() {
    this.applicationId = process.env.SEND_BIRD_APP_ID;
  }
}
