export class AuthUser {
  username: string = '';
  token: string = '';
  type: string = '';
  entityId: string = '';

  constructor(username: string, token: string, type: string, entityId: string) {
    this.username = username;
    this.token = token;
    this.type = type;
    this.entityId = entityId;
  }
}
