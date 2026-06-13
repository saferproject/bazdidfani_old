import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { Controller } from "react-hook-form";

const SelectCustom = ({
	error = "",
	control,
	name,
	label,
	items,
	valueProperty = "value",
	titleProperty = "title",
	className = "",
	fullWidth = true,
	disabled = false,
	readOnly = false,
	helperText = " ",
	rules,
	sx,
	size,
	required,
}: {
	error?: any;
	control: any;
	name: string;
	label: string;
	items: any[];
	valueProperty?: string;
	titleProperty?: string;
	className?: string;
	fullWidth?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	helperText?: string;
	rules?: any;
	sx?: any;
	size?: "small" | "medium";
	required?: boolean;
}) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue=""
			render={({ field }) => (
				<FormControl
					fullWidth={fullWidth}
					className={className}
				>
					{/* <InputLabel shrink={field.value ? true : false} id={`${name}-label`} size="small"> */}
					<InputLabel
						shrink={true}
						className="bg-white px-2"
						id={`${name}-label`}
						size="small"
					>
						{label}
					</InputLabel>
					<div className="relative">
						<Select
							key={field.value}
							disabled={disabled}
							{...field}
							value={field.value || ""}
							onChange={(e) => field.onChange(e.target.value || "")}
							readOnly={readOnly}
							label={label}
							labelId={`${name}-label`}
							id={`${name}-select`}
							error={!!error?.message}
							className={"overflow-x-hidden w-full " + className}
							MenuProps={{ disableScrollLock: true }}
							// input={<OutlinedInput notched label={label} />}
							sx={{
								borderRadius: "8px",
								"& .MuiOutlinedInput-notchedOutline": {
									borderRadius: "8px",
								},
								...sx,
							}}
							size={size}
							required={required}
						>
							{items?.map((item: any) => (
								<MenuItem
									key={item[valueProperty]}
									className="overflow-x-hidden font-medium"
									value={item[valueProperty]}
								>
									{item[titleProperty]}
								</MenuItem>
							))}
						</Select>
						{field.value && !disabled && !readOnly && (
							<IconButton
								size="small"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => field.onChange("")}
								sx={{
									position: "absolute",
									right: 32,
									top: "50%",
									transform: "translateY(-50%)",
									p: "2px",
								}}
							>
								<CloseCircle size="16" />
							</IconButton>
						)}
					</div>
					<FormHelperText className="text-[#d32f2f]! text-xs absolute bottom-0 translate-y-4">{error ? helperText : ""}</FormHelperText>
				</FormControl>
			)}
		/>
	);
};

export default SelectCustom;
