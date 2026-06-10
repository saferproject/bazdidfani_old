import { Control, RegisterOptions, UseFormGetValues, UseFormSetFocus, UseFormSetValue } from "react-hook-form";

export default interface NumericInputProps {
	name: string;
	defaultValue: number;
	control: Control<any, any, any>;
	rules: Omit<RegisterOptions<any, any>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
	setValue: UseFormSetValue<any>;
	setFocus: UseFormSetFocus<any>;
	getValue: UseFormGetValues<any>;
	step?: number;
	min?: number;
	max?: number;
}