// export interface User {
//   userId: number;
//   name: string;
//   emailId: string;
//   passwordHash: string;
//   phoneno?:string;
//   profilepic?:string;
//   createdAt: string;
//   updatedAt?: string;
//   isActive: boolean;
//   isAdmin: boolean;

//    houseNo?: string;
//   locality?: string;
//   landmark?: string;
//   city?: string;
//   district?: string;
//   pincode?: string;
//   state?: string;

//   Address?: string;
// }

export interface User {
  userId: number;
  name: string;
  emailId: string;
  passwordHash?: string;   // optional, only used internally
  phoneNo?: string;        // ✅ match backend casing
  profilePic?: string;     // ✅ match backend casing
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
  fullAddress?: string;
  createdAtFormatted?: string | null;
  updatedAtFormatted?: string | null;
}


