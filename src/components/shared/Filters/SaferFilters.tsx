import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { Eraser, Filter, SearchNormal1, TableDocument } from "iconsax-reactjs";
import { Controller, useForm, useWatch } from "react-hook-form";
import SaferFiltersBaseForm from "./interfaces/safer-filters-base-form.interface";
import PlateTextField from "../Inputs/PlateTextField";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SAFER_FILTERS_BASE_FORM_INITIAL from "./constants/safer-filters-base-form-initial";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { RiFileExcel2Line } from "react-icons/ri";

export default function SaferFilters({
	mode = "NO_SEARCH_PARAMS",
	search = false,
	plaque = false,
	date = false,
	delay = 1000,
	filters = [],
	onFilter,
	onGetExcel,
}: {
	mode?: "NO_SEARCH_PARAMS" | "SEARCH_PARAMS";
	search?: boolean;
	plaque?: boolean;
	date?: boolean;
	delay?: number;
	filters?: Array<{
		label: string;
		field: string;
		type: "string" | "number" | "boolean" | "select";
		options?: Array<{ value: number | string; label: string }>;
		activeLabel?: string;
		inActiveLabel?: string;
	}>;
	onFilter: (filters: SaferFiltersBaseForm & Record<string, string | number | boolean>) => void;
	onGetExcel: (filters: SaferFiltersBaseForm & Record<string, string | number | boolean>) => void;
}) {
	const [isFiltersVisible, setFiltersVisibility] = useState(false);

	const isPhone = useIsPhone();

	const timer = useRef(null);
	const ignoreNextSync = useRef(false);

	const [searchParams, setSearchParams] = useSearchParams();

	const { register, watch, setValue, reset, control } = useForm<SaferFiltersBaseForm & Record<string, string>>({
		mode: "onBlur",
		defaultValues: {
			...SAFER_FILTERS_BASE_FORM_INITIAL,
			...filters.reduce((acc, cur) => {
				acc[cur.field] = "";
				return acc;
			}, {} as Record<string, string>),
		},
	});

	const values = useWatch({ control });

	const handleClearFilters = () => {
		ignoreNextSync.current = true;

		reset({
			...SAFER_FILTERS_BASE_FORM_INITIAL,
			...filters.reduce((acc, cur) => {
				acc[cur.field] = "";
				return acc;
			}, {} as Record<string, string>),
		});
		onFilter({});
		setSearchParams({});
	};

	const handleToggleFiltersVisibility = () => {
		setFiltersVisibility((currentValue) => !currentValue);
	};

	const filterInputs = useMemo(
		() =>
			filters.map(({ label, field, type, options, activeLabel, inActiveLabel }) => {
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
									/>
								)}
							/>
						);

					case "boolean":
						return (
							<div>
								<label htmlFor={field}>{activeLabel}</label>
								<Switch
									id={field}
									title={label}
									checked={!!Number(watch(field))}
									onChange={() => setValue(field, watch(field) == "1" ? "0" : "1")}
									className="rotate-180"
								/>
								<label htmlFor={field}>{inActiveLabel}</label>
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
										<InputLabel id={"filter-select-" + label}>{label}</InputLabel>
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
									</FormControl>
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
									/>
								)}
							/>
						);
				}
			}),
		[filters, isPhone]
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
			if (mode === "SEARCH_PARAMS") setSearchParams(Object.entries(values).filter(([key, value]) => value));
		}, delay);
	}, [values]);

	return (
		<form
			autoComplete="off"
			className={
				"flex items-center gap-4 " +
				(isPhone ? (isFiltersVisible ? "flex-col mb-4 overflow-hidden" : "flex-col mb-4 h-8 overflow-hidden") : "")
			}
		>
			{isPhone ? (
				<>
					<Button
						startIcon={
							<Filter
								size="24"
								className="text-blue-500"
							/>
						}
						variant="text"
						className="flex justify-start items-center text-blue-500"
						onClick={handleToggleFiltersVisibility}
						fullWidth
					>
						{isFiltersVisible ? "مخفی کردن فیلتر ها" : "نمایش فیلتر ها"}
					</Button>
					<Button
						startIcon={
							<Eraser
								size="24"
								className="text-red-500"
							/>
						}
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
						<Eraser
							size="24"
							className="text-red-500"
						/>
					</IconButton>
					<IconButton
						size="small"
						className="border border-blue-500 rounded-lg"
						onClick={() => onGetExcel(values)}
					>
						<RiFileExcel2Line
							size="24"
							className="text-blue-500"
						/>
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
					<PlateTextField
						control={control}
						watch={watch}
					/>
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
