export class Participant {
  actor: { reference: string };
  required: string;
  status: string;

  constructor(reference: string, required: string, status: string) {
    this.actor = { reference };
    this.required = required;
    this.status = status;
  }
}
