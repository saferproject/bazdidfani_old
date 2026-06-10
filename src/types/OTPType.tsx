export interface OTPSendCodeRequestDataType {
	phone: string;
	check: 1 | 0;
	two_authentication: boolean;
}

export interface OTPValidatePhoneType {
	token: number;
	data: string;
	"forget-pass": boolean;
	two_authentication: boolean;
}
