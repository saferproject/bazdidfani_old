import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { ConvertDatetoDateTime } from "../../../utilities/Helper";
import { faIR as datePickerFaIR } from "@mui/x-date-pickers/locales";
import { Calendar } from "iconsax-reactjs";

export default function DatePickerComponent({
	control,
	name,
	label,
	className,
	size = "small",
	rules,
	error,
	...other
}: {
	control?: any;
	name: string;
	label: string;
	className?: string;
	size?: string;
	rules?: any;
	error?: boolean;
	[key: string]: any;
}) {
	return (
		<div
			dir="rtl"
			className={`${className || ""} h-full`}
		>
			<LocalizationProvider
				dateFormats={{ monthShort: "MMMM" }}
				dateAdapter={AdapterDateFnsJalali}
				localeText={datePickerFaIR.components.MuiLocalizationProvider.defaultProps.localeText}
			>
				<Controller
					name={name}
					control={control}
					rules={rules}
					defaultValue={null}
					render={({ field, fieldState }) => {
						return (
							<DatePicker
								{...field}
								{...other}
								className="w-full"
								value={field.value ? new Date(field.value) : null}
								onChange={(date) => {
									field.onChange(date ? ConvertDatetoDateTime(date) : null);
								}}
								slotProps={{
									textField: {
										size: size as any,
										error: error,
										helperText: fieldState?.error?.message,
										required: !!rules?.required,
										InputLabelProps: { shrink: true },
										InputProps: { sx: { borderRadius: "8px" } },
									},
								}}
								slots={{
									openPickerIcon: () => (
										<Calendar
											size="24"
											className="text-primary"
										/>
									),
								}}
								label={label}
							/>
						);
					}}
				/>
			</LocalizationProvider>
		</div>
	);
}
