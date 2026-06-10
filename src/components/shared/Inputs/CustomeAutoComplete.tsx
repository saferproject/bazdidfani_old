import { Autocomplete, FilterOptionsState, TextField } from "@mui/material";
import { useEffect, useMemo } from "react";
import { Controller, Control, UseFormSetValue } from "react-hook-form";

type DebouncedCallback<T> = ((value: T) => void) & { cancel: () => void };

function debounce<T>(callback: (value: T) => void, delay: number): DebouncedCallback<T> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const debounced = ((value: T) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback(value), delay);
	}) as DebouncedCallback<T>;

	debounced.cancel = () => {
		if (timeoutId) clearTimeout(timeoutId);
	};

	return debounced;
}

interface CustomAutoCompleteProps {
	name: string;
	control: Control<any>;
	data: any[];
	loading?: boolean;
	setValue: UseFormSetValue<any>;
	searchName: string;
	label: string;
	className?: string;
	defaultValue?: any;
	showField: string;
	disabled?: boolean;
	readOnly?: boolean;
	rules?: any;
	error?: boolean;
	helperText?: string;
	placeholder?: string;
	required?: boolean;
	filterOptions?: (options: any[], state: FilterOptionsState<any>) => any[];
}

export default function CustomeAutoComplete({
	name,
	control,
	data,
	loading,
	setValue,
	searchName,
	label,
	rules,
	className = "",
	defaultValue = null,
	showField,
	disabled = false,
	readOnly = false,
	placeholder = "",
	required,
	filterOptions,
}: CustomAutoCompleteProps) {
	const handleDebouncedChange = useMemo(
		() =>
			debounce<string>((newInputValue) => {
				setValue(searchName, newInputValue);
			}, 500),
		[searchName, setValue]
	);

	useEffect(() => () => handleDebouncedChange.cancel(), [handleDebouncedChange]);

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={null}
			rules={rules}
			render={({ field, fieldState }) => {
				defaultValue &&
					defaultValue !== "" &&
					!fieldState.isTouched &&
					(field.value = data ? data.find((item) => item?.uuid === defaultValue) : null);

				return (
					<Autocomplete
						{...field}
						disabled={disabled}
						className={className}
						readOnly={readOnly}
						defaultValue={defaultValue}
						disablePortal
						id={`autocomplete-${name}`}
						options={data ?? []}
						loading={loading}
						onChange={(_event, newValue) => field.onChange(newValue)}
						filterOptions={filterOptions}
						value={field.value}
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: "8px",
							},
						}}
						getOptionLabel={(option: any) => (option ? option[showField] : null)}
						renderInput={(params) => (
							<TextField
								{...params}
								required={required ?? !!rules?.required}
								label={label}
								error={!!fieldState.error}
								helperText={fieldState?.error?.message}
								placeholder={placeholder}
								onChange={(event) => handleDebouncedChange(event.target.value)}
								slotProps={{
									inputLabel: {
										shrink: true,
									},
								}}
							/>
						)}
					/>
				);
			}}
		/>
	);
}
