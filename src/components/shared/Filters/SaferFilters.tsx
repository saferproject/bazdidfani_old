import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import PlateTextField from "../Inputs/PlateTextField";
import SAFER_FILTERS_BASE_FORM_INITIAL from "./constants/safer-filters-base-form-initial";
import SaferFiltersBaseForm from "./interfaces/safer-filters-base-form.interface";
import { Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography } from "@mui/material";
import TextField from "../Inputs/SaferTextField";
import { CloseCircle, Eraser, Filter, SearchNormal1, TableDocument } from "iconsax-reactjs";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FaX } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";

export default function SaferFilters({
  mode = "NO_SEARCH_PARAMS",
  search = false,
  plaque = false,
  date = false,
  delay = 1000,
  filters = [],
  onFilter,
  onGetExcel,
  excelLoading,
}: {
  mode?: "NO_SEARCH_PARAMS" | "SEARCH_PARAMS";
  search?: boolean;
  plaque?: boolean;
  date?: boolean;
  delay?: number;
  filters?: Array<{
    label: string;
    field: string;
    type: "string" | "number" | "boolean" | "select" | "autocomplete";
    options?: Array<{ value: number | string; label: string }>;
    activeLabel?: string;
    inActiveLabel?: string;
    autocompleteOptions?: any[];
    autocompleteLoading?: boolean;
    optionLabel?: string;
    optionValue?: string;
    onSearchChange?: (query: string) => void;
    CustomPaperComponent?: (props: any) => ReactNode;
    disableCloseOnSelect?: boolean;
  }>;
  onFilter: (
    filters: SaferFiltersBaseForm & Record<string, string | number | boolean>,
  ) => void;
  onGetExcel: (
    filters: SaferFiltersBaseForm & Record<string, string | number | boolean>,
  ) => void;
  excelLoading?: boolean;
}) {
  const [isFiltersVisible, setFiltersVisibility] = useState(false);

  const isPhone = useIsPhone();

  const timer = useRef(null);
  const ignoreNextSync = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const { register, watch, setValue, reset, control } = useForm<
    SaferFiltersBaseForm & Record<string, string>
  >({
    mode: "onBlur",
    defaultValues: {
      ...SAFER_FILTERS_BASE_FORM_INITIAL,
      ...filters.reduce(
        (acc, cur) => {
          acc[cur.field] = "";
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
  });

  const values = useWatch({ control });

  const handleClearFilters = () => {
    ignoreNextSync.current = true;

    reset({
      ...SAFER_FILTERS_BASE_FORM_INITIAL,
      ...filters.reduce(
        (acc, cur) => {
          acc[cur.field] = "";
          return acc;
        },
        {} as Record<string, string>,
      ),
    });
    onFilter({});
    setSearchParams({});
  };

  const handleToggleFiltersVisibility = () => {
    setFiltersVisibility((currentValue) => !currentValue);
  };

  const filterInputs = useMemo(
    () =>
      filters.map(
        ({ label, field, type, options, activeLabel, inActiveLabel, autocompleteOptions, autocompleteLoading, optionLabel, optionValue, disableCloseOnSelect, onSearchChange, CustomPaperComponent }) => {
          switch (type) {
            case "number":
              return (
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      variant="outlined"
                      type="number"
                      fullWidth={isPhone}
                      slotProps={{
                        input: {
                          endAdornment: field.value && (
                            <FaX
                              className="w-4 h-4 select-none cursor-pointer"
                              onClick={() => field.onChange(null)}
                            />
                          ),
                        },
                      }}
                    />
                  )}
                />
              );

            case "boolean":
              return (
                <div className={`flex flex-row flex-nowrap items-center${isPhone ? " w-full" : ""}`}>
                  <label className="text-nowrap" htmlFor={field}>{activeLabel}</label>
                  <Switch
                    id={field}
                    title={label}
                    checked={!!Number(watch(field))}
                    onChange={() =>
                      setValue(field, watch(field) == "1" ? "0" : "1")
                    }
                    className="rotate-180"
                  />
                  <label className="text-nowrap" htmlFor={field}>{inActiveLabel}</label>
                </div>
              );

            case "select":
              return (
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      className={isPhone ? "w-full" : "w-48"}
                      size="small"
                    >
                      <InputLabel id={"filter-select-" + label}>
                        {label}
                      </InputLabel>
                      <Select
                        {...field}
                        labelId={"filter-select-" + label}
                        label={label}
                        sx={{
                          borderRadius: "8px",
                        }}
                      >
                        {options.map(({ value, label }) => (
                          <MenuItem value={value}>{label}</MenuItem>
                        ))}
                      </Select>
                      {field.value && (
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
                    </FormControl>
                  )}
                />
              );

            case "autocomplete":
              return (
                <Controller
                  name={field}
                  control={control}
                  render={() => (
                    <Autocomplete
                      slots={{
                        paper: CustomPaperComponent
                      }}
                      options={autocompleteOptions ?? []}
                      loading={autocompleteLoading}
                      getOptionLabel={(option: any) =>
                        typeof option === "string" ? option : (option[optionLabel ?? "name"] ?? "")
                      }
                      value={
                          watch(`${field}-field`)
                      }
                      disableCloseOnSelect={disableCloseOnSelect}
                      onChange={(_event, newValue, reason) => {
                        if (reason === "clear") {
                          setValue(`${field}-field`, undefined);
                          setValue(`${field}`, undefined);
                        } else{
                          setValue(`${field}-field`, newValue);
                          setValue(field, newValue[`${optionValue}`]);
                        }
                      }}
                      onInputChange={(_event, _newInputValue, reason) => {
                        if (reason === "input" && onSearchChange) {
                          onSearchChange(_newInputValue);
                        }
                      }}
                      isOptionEqualToValue={(option, value) =>
                        String(option[optionValue ?? "id"]) === String(value[optionValue ?? "id"])
                      }
                      className={isPhone ? "w-full" : "w-48"}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={label}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {autocompleteLoading ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              );

            default:
              return (
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      variant="outlined"
                      type="text"
                      fullWidth={isPhone}
                      slotProps={{
                        input: {
                          endAdornment: field.value && (
                            <div className="hover:shadow-sm transition-all rounded-full p-1 hover:bg-slate-100">
                              <FaX
                                className="w-4 h-4 select-none cursor-pointer"
                                onClick={() => field.onChange("")}
                              />
                            </div>
                          ),
                        },
                      }}
                    />
                  )}
                />
              );
          }
        },
      ),
    [filters, isPhone],
  );

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    if (Object.keys(params).length) reset(params);
  }, []);

  useEffect(() => {
    if (ignoreNextSync.current) {
      ignoreNextSync.current = false;
      return; // skip one sync cycle
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      onFilter(values);

      //@ts-ignore
      if (mode === "SEARCH_PARAMS")
        setSearchParams(Object.entries(values).filter(([key, value]) => value));
    }, delay);
  }, [values]);

  return (
    <form
      autoComplete="off"
      className={
        "flex items-center gap-4 " +
        (isPhone
          ? isFiltersVisible
            ? "flex-col mb-4 overflow-hidden"
            : "flex-col mb-4 h-8 overflow-hidden"
          : "flex-wrap")
      }
    >
      {isPhone ? (
        <>
          <Button
            startIcon={<Filter size="24" className="text-blue-500" />}
            variant="text"
            className="flex justify-start items-center text-blue-500"
            onClick={handleToggleFiltersVisibility}
            fullWidth
          >
            {isFiltersVisible ? "مخفی کردن فیلتر ها" : "نمایش فیلتر ها"}
          </Button>
          <Button
            startIcon={<Eraser size="24" className="text-red-500" />}
            variant="text"
            color="error"
            className="flex justify-start items-center"
            onClick={handleClearFilters}
            fullWidth
          >
            پاک کردن فیلتر ها
          </Button>
        </>
      ) : (
        <>
          <IconButton
            size="small"
            className="border border-red-500 rounded-lg"
            onClick={handleClearFilters}
          >
            <Eraser size="24" className="text-red-500" />
          </IconButton>
          <IconButton
            size="small"
            className="border border-blue-500 rounded-lg"
            onClick={() => onGetExcel(values)}
            disabled={excelLoading}
          >
            { excelLoading ? <CircularProgress className="text-blue-500 w-6 h-6" /> : <RiFileExcel2Line size="24" className="text-blue-500" /> }
          </IconButton>
        </>
      )}
      {search && (
        <TextField
          {...register("query")}
          label="جستجو"
          variant="outlined"
          type="search"
          slotProps={{
            input: {
              className: "flex items-center gap-2",
              startAdornment: <SearchNormal1 size="24" />,
            },
          }}
          fullWidth={isPhone}
        />
      )}
      {plaque && (
        <div className={isPhone ? "w-full" : "w-48"}>
          <PlateTextField control={control} watch={watch} />
        </div>
      )}
      {date && (
        <>
          <div className={isPhone ? "w-full" : "w-48"}>
            <DatePickerComponent
              name="start_date"
              label="از تاریخ"
              control={control}
            />
          </div>
          <div className={isPhone ? "w-full" : "w-48"}>
            <DatePickerComponent
              name="end_date"
              label="تا تاریخ"
              control={control}
            />
          </div>
        </>
      )}
      {filterInputs}
    </form>
  );
}
