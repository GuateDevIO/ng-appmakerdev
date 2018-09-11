export interface IUser {
  uid: string;
  displayName: string;
}

export class User {
  constructor(
    public uid: string,
    public displayName: string,
    public photoUrl: string,
    public loading?: boolean,
    public notify?: boolean,
    public message?: string
  ) {}
}
