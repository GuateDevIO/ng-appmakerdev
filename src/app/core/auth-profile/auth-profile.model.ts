export interface Profile {
  pushKey: string;
  loading: boolean;
  text: string;
  votes: number;
  error?: string;
  email?: string | null;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  verified?: boolean;
  organization?: string;
  country?: string;
}
