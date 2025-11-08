enum user_gender {
    'MALE',
    'FEMALE'
}

export interface User {
  id: string; // UUID
  username: string;
  name: string;
  email: string;
  avatar?: string; // Optional
  bio?: string; // Optional
  created_at: Date;
  gender?: user_gender; // Optional, assuming user_gender is an enum
}

export interface CreateUserRequest {
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  gender?: user_gender;
}
