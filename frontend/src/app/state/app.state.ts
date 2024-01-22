// app.state.ts
import { AuthState } from './auth/auth.reducer';
import { AvatarState } from './avatar/profile.reducer';

export interface AppState {
  auth: AuthState;
  avatar: AvatarState;
}
