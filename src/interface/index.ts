export interface SingleFileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | string | null;
}


export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'instructor' | 'admin' | 'super_admin';
  isActive: boolean;
  isVerified: boolean;
  profile?: string;
  createdAt?: Date;
};
