import { Role } from "./Role";
import { User } from "./User";

export class UserProfile {

  id: number;
  email: string;
  displayName: string;
  profilePictureUrl?: string | null;
  role: Role;
  emailIsVerified: boolean;

  constructor(user: User) {
    this.id = user.id
    this.email = user.email
    this.displayName = user.displayName
    this.role = user.role
    this.profilePictureUrl = user.profilePictureUrl
    this.emailIsVerified = user.emailIsVerified

  }

}
