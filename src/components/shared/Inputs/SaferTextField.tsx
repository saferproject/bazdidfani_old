import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";
import { ToEnglishNumber } from "../Functions/ChangeNumLang";

const SaferTextField = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
	const { onChange, ...rest } = props;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		event.target.value = ToEnglishNumber(event.target.value) ?? event.target.value;
		onChange?.(event);
	};

	return <TextField {...rest} onChange={handleChange} ref={ref} />;
});

SaferTextField.displayName = "SaferTextField";

export type { TextFieldProps };
export default SaferTextField;
