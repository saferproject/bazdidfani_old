export interface PropsType {
  handleChangePage: (number: 0 | 1 | 2) => void;
  activePage?: number;
}

export interface ValidatePhonePropsType extends PropsType {
  activePage: 0 | 1 | 2;
}

export interface LoginDataOrChangePasswordType {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export interface NewPasswordDataType {
  data: string;
  token: string;
  password: string;
  password_confirmation: string;
}
