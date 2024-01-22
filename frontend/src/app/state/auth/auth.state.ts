export interface AuthState {
    userId: string | null;
    username: string | null;
    token: string | null;
    role: string | null;
    error: string | null; // to handle any authentication error
    loading: boolean; // to indicate loading state during async operations
  }
  
  export const initialAuthState: AuthState = {
    userId: null,
    username: null,
    token: null,
    role: null,
    error: null,
    loading: false,
  };
  