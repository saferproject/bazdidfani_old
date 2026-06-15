import { FormHelperText, InputBase } from "@mui/material";
import React, { RefObject, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

function SelectOnFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select();
}

type PlateTextFieldProps = {
  control: any;
  readOnly?: boolean;
  disabled?: boolean;
  watch: any;
  error?: boolean;
  helperText?: string;






  rules?: any;
};

export default function PlateTextField({
  control,
  watch,
  error,
  helperText,
  rules,
  readOnly = false,
  disabled = false,
}: PlateTextFieldProps) {
  const [PlateColors, setPlateColors] = React.useState({
    backColor: "#FDCB18",
    color: "#000",
  });

  useEffect(() => {
    if (watch("third_character") === "" || watch("third_character") === " ") {
      setPlateColors({ backColor: "transparent", color: "inherit" });
    } else if (["ت", "ع", "ک"].includes(watch("third_character"))) {
      setPlateColors({ backColor: "#FDCB18", color: "#000" });
    } else if (["ش", "پ", "ث"].includes(watch("third_character"))) {
      setPlateColors({ backColor: "#01542A", color: "#FFFFFF" });
    } else if (watch("third_character") === "ا") {
      setPlateColors({ backColor: "#ED1C24", color: "#FFFFFF" });
    } else {
      setPlateColors({ backColor: "#FFFFFF", color: "#000" });
    }
  }, [watch, watch("third_character")]);

  //Focus Functions
  const thirdChractorRef: RefObject<HTMLInputElement | null> = useRef(null);
  const secondNumberRef: RefObject<HTMLInputElement | null> = useRef(null);
  const fourthNumberRef: RefObject<HTMLInputElement | null> = useRef(null);

  const thirdChractorFocus = () => {
    if (watch("first_number")?.length === 2 && thirdChractorRef.current) {
      secondNumberRef.current.focus();
    }
  };

  const secondNumberFocus = () => {
    if (watch("third_character")?.length === 1 && secondNumberRef.current) {
      secondNumberRef.current.focus();
    }
  };

  const fourthNumberFocus = () => {
    if (watch("second_number")?.length === 3 && fourthNumberRef.current) {
      fourthNumberRef.current.focus();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex h-10 w-full font-bold">
        <div
          style={{
            backgroundColor: PlateColors.backColor,
            color: PlateColors.color,
          }}
          className="w-[25%] h-full rounded-r-lg p-1 flex flex-col justify-center items-center gap-1 border-y border-r border-black"
        >
          {/* <p className="text-[10px] leading-3">ایران</p> */}
          <Controller
            rules={rules}
            name="fourth_number"
            control={control}
            disabled={disabled}
            render={({ field }) => (
              <InputBase
                inputRef={fourthNumberRef}
                {...field}
                inputProps={{
                  mask: "00",
                  style: { textAlign: "center", padding: 0, fontWeight: 700 },
                  inputMode: "numeric",
                }}
                className="p-0"
                onFocus={SelectOnFocus}
                autoComplete="off"
                placeholder="--"
                inputMode="numeric"
                inputComponent={TextMaskCustom as any}
                readOnly={readOnly}
                disabled={disabled}
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: PlateColors.color,
                  "& .Mui-disabled": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                  "& .Mui-readOnly": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                }}
              />
            )}
          />
        </div>
        <div className="py-1 w-px flex justify-center items-center border-y border-black bg-black">
          <div className="h-full w-full flex justify-evenly bg-black"></div>
        </div>
        <div
          style={{
            backgroundColor: PlateColors.backColor,
            color: PlateColors.color,
          }}
          className="flex flex-1 border-y border-black"
        >
          <Controller
            rules={rules}
            name="second_number"
            control={control}
            disabled={disabled}
            render={({ field }) => (
              <InputBase
                inputRef={secondNumberRef}
                {...field}
                className="p-0"
                inputProps={{
                  mask: "000",
                  style: { textAlign: "center", padding: 0 },
                  inputMode: "numeric",
                }}
                onFocus={SelectOnFocus}
                autoComplete="off"
                placeholder="---"
                inputMode="numeric"
                inputComponent={TextMaskCustom as any}
                readOnly={readOnly}
                disabled={disabled}
                onKeyUp={fourthNumberFocus}
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: PlateColors.color,
                  "& .Mui-disabled": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                  "& .Mui-readOnly": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                }}
              />
            )}
          />
          <Controller
            rules={rules}
            name="third_character"
            control={control}
            defaultValue={"ع"}
            disabled={disabled}
            render={({ field }) => (
              <InputBase
                inputRef={thirdChractorRef}
                {...field}
                className="p-0"
                inputProps={{
                  mask: "#",
                  style: { textAlign: "center", padding: 0 },
                  defaultValue: "ع"
                }}
                onFocus={SelectOnFocus}
                autoComplete="off"
                placeholder="-"
                defaultValue={"ع"}
                inputComponent={TextMaskCustom as any}
                readOnly={readOnly}
                disabled={disabled}
                onKeyUp={secondNumberFocus}
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: PlateColors.color,
                  "& .Mui-disabled": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                  "& .Mui-readOnly": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                }}
              />
            )}
          />
          <Controller
            rules={rules}
            name="first_number"
            control={control}
            disabled={disabled}
            render={({ field }) => (
              <InputBase
                {...field}
                inputProps={{
                  mask: "00",
                  style: { textAlign: "center", padding: 0 },
                  inputMode: "numeric",
                }}
                className="p-0"
                onFocus={SelectOnFocus}
                autoComplete="off"
                placeholder="--"
                inputMode="numeric"
                inputComponent={TextMaskCustom as any}
                readOnly={readOnly}
                disabled={disabled}
                onKeyUp={thirdChractorFocus}
                sx={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: PlateColors.color,
                  "& .Mui-disabled": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                  "& .Mui-readOnly": {
                    color: "black !important",
                    WebkitTextFillColor: "black !important",
                  },
                }}
              />
            )}
          />
        </div>
        <div className="w-[7%] rounded-l-lg bg-[#00349a]"></div>
      </div>
      <FormHelperText className="text-[#d32f2f]! text-xs absolute bottom-0 translate-y-4">
        {error ? helperText : ""}
      </FormHelperText>
    </div>
  );
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        overwrite={false}
        definitions={{
          "#": /^[\u0600-\u06FF\s]+$/,
        }}
        inputRef={ref as any}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  },
);
