export interface User {
  userId: number;
  name: string;
  emailId: string;
  passwordHash?: string;   
  phoneNo?: string;        
  profilePic?: string;     
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  isAdmin: boolean;

  // Address fields
  houseNo?: string;
  locality?: string;
  landmark?: string;
  city?: string;
  district?: string;
  pincode?: string;
  state?: string;

  // UI extras
  address: string;
  createdAtFormatted?: string | null;
  updatedAtFormatted?: string | null;
}


