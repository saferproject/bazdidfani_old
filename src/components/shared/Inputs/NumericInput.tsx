import { FC, useRef } from "react";
import { IconButton, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { Add, Minus } from "iconsax-reactjs";

import NumericInputProps from "./interfaces/numeric-input-props";

const NumericInput: FC<NumericInputProps> = ({ name, control, rules, defaultValue, setValue, setFocus, step = 1, min, max }) => {
	const HTNLInput = useRef<HTMLInputElement>(null);

	const handleIncrement = () => {
		HTNLInput.current.stepUp();
		setValue(name, +HTNLInput.current.value);
		setFocus(name);
	};

	const handleDecrement = () => {
		HTNLInput.current.stepDown();
		setValue(name, +HTNLInput.current.value);
		setFocus(name);
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue={defaultValue}
			render={({ field }) => (
				<TextField
					{...field}
					type="number"
					variant="outlined"
					slotProps={{
						htmlInput: {
							style: { textAlign: "center", direction: "ltr" },
							step,
							min,
							max,
							ref: HTNLInput,
						},
						input: {
							startAdornment: (
								<IconButton
									onClick={handleIncrement}
									size="small"
									color="success"
								>
									<Add size="24" />
								</IconButton>
							),
							endAdornment: (
								<div className="flex items-center gap-2">
									<IconButton
										onClick={handleDecrement}
										size="small"
										color="error"
									>
										<Minus size="24" />
									</IconButton>
									<p className="text-sm font-Yekan-Bakh">تومان</p>
								</div>
							),
						},
					}}
					fullWidth
				/>
			)}
		/>
	);
};

export default NumericInput;
