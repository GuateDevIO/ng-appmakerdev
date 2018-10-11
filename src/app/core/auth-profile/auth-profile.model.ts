export interface Profile {
  uid?: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  phoneNumber?: string;
  providerId?: string;
  verified?: boolean;
  organization?: string;
  country?: string;
  loading?: boolean;
  error?: string;
}
