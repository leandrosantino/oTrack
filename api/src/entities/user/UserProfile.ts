import { Roules } from "./Roule";
import { User } from "./User";

export class UserProfile {

  id: number;
  username: string;
  displayName: string;
  roule: Roules;

  constructor(user: User) {
    this.id = user.id
    this.username = user.username
    this.displayName = user.displayName
    this.roule = user.roule
  }

}
