import { UserProfile } from "user/dto/UserProfile";

export interface EventClient {
  profile: UserProfile;
  on(event: string, callback: (payload: any) => void): void;
  emit(event: string, payload: any): void;
  onClose(callback: () => void): void;
}
