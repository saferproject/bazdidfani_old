export interface ProfileDataType {
  full_name: string;
  email: string;
  national_code: number | null;
  user_id: string;
  father_name: string;
  address: string;
  phone: string;
  old_password: string;
  password: string;
  password_confirmation: string;
  city_id: any;
  birthdate: Date | null;
  telephone: string;
  citySearch: string;
  cities: any;
  isChangePass: boolean;
  image: string;
}

export const EmptyProfileData: ProfileDataType = {
  full_name: "",
  email: "",
  national_code: null,
  user_id: "",
  father_name: "",
  address: "",
  phone: "",
  old_password: "",
  password: "",
  password_confirmation: "",
  city_id: "",
  birthdate: null,
  telephone: "",
  citySearch: "",
  cities: null,
  isChangePass: false,
  image: ''
};
