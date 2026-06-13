import { ConvertDatetoDateTime } from "../../../utilities/Helper";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { faIR as datePickerFaIR } from "@mui/x-date-pickers/locales";
import { Calendar } from "iconsax-reactjs";
import { Controller } from "react-hook-form";

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
    <div dir="rtl" className={`${className || ""} h-full`}>
      <LocalizationProvider
        dateFormats={{ monthShort: "MMMM" }}
        dateAdapter={AdapterDateFnsJalali}
        localeText={
          datePickerFaIR.components.MuiLocalizationProvider.defaultProps
            .localeText
        }
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
                  field: { clearable: true },
                  textField: {
                    size: size as any,
                    error: error,
                    helperText: fieldState?.error?.message,
                    required: !!rules?.required,
                    InputLabelProps: { shrink: true },
                    InputProps: { sx: { borderRadius: "8px" } },
                  },
                  clearButton: {
                    className: "p-0.5!"
                  }
                }}
                slots={{
                  openPickerIcon: () => (
                    <Calendar size="24" className="text-primary" />
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
