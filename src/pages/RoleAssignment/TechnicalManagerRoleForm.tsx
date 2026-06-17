import { FC, useEffect, useRef, useState } from "react";

import {
	useDeleteTechnicalManagerCertificateMutation,
	useTechnicalManagerRoleDataQuery,
	useUpdateTechnicalManagerRoleDataMutation,
} from "./api/role-assignment.api";

import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterTechnicalManagerMutation } from "../../api/Profile/Register/TechnicalManager";

import TechnicalManagerFormProps from "./interfaces/technical-manager-role-form-props.interface";
import TechnicalManagerFormSchema, { TechnicalManagerFormType, TechnicalManagerInqueryFormSchema, TechnicalManagerInqueryFormType } from "./schemas/technical-manager-form.schema";

import { dataUrlToFile } from "../../utilities/dataURLToFile";
import { useAppSelector } from "../../Stores/hooks";
import SweetAlertToast from "../../components/shared/Functions/SweetAlertToast";
import ImageComponent from "../../components/shared/Image/Image";
import { useNavigate } from "react-router-dom";
import CertificateImage from "./interfaces/certificate-image.interface";
import TechnicalManagerRoleData from "./interfaces/technical-manager-role-data.interface";
import { Trash, Image } from "iconsax-reactjs";
import { STORAGE_URL } from "../../Stores/api-urls";
import { compressImage } from "../../utilities/compress-image";

const TechnicalManagerForm: FC<TechnicalManagerFormProps> = ({ formState }) => {
	const userPhoneNumber = useAppSelector((state) => state.user.personal.phone);
	const nationalCode = useAppSelector((state) => state.user.personal.national_code);

	const navigate = useNavigate();

	const freighterCertificationInput = useRef<HTMLInputElement>(null);
	const passengerCertificationInput = useRef<HTMLInputElement>(null);

	const [freighterCertificationImage, setFreighterCertificationImage] = useState<CertificateImage | null>(null);
	const [passengerCertificationImage, setPassengerCertificationImage] = useState<CertificateImage | null>(null);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		reset,
		resetField,
		trigger,
		control,
		formState: { errors },
	} = useForm<TechnicalManagerInqueryFormType>({
		defaultValues: { type: 1, phone: userPhoneNumber, national_code: nationalCode ?? "" },
		resolver: zodResolver(TechnicalManagerInqueryFormSchema),
	});

	useEffect(() => {
		console.error(errors);
	}, [errors]);

	const { capacity, freighter_capacity, passenger_capacity, type } = useWatch<TechnicalManagerFormType>({ control });

	const [registerTechnicalManagerFn, registerTechnicalManagerResult] = useRegisterTechnicalManagerMutation();
	const [updateTechnicalManagerRoleDataFn, updateTechnicalManagerRoleDataResult] = useUpdateTechnicalManagerRoleDataMutation();
	const [deleteTechnicalManagerCertificateFn, deleteTechnicalManagerCertificateResult] = useDeleteTechnicalManagerCertificateMutation();
	const technicalManagerRoleData = useTechnicalManagerRoleDataQuery(undefined, { skip: formState === "ADD" });

	// TODO: later make images required based on selected type
	const onSubmit = async (data: TechnicalManagerFormType) => {
		const formData = new FormData();

		for (const key in data) if (data[key]) formData.append(key, data[key]);

		// ? چون به عکس های روی سرور دسترسی در کد نداریم شرط دوم را گذاشتم
		if (freighterCertificationImage && !freighterCertificationImage.image.includes("http"))
			formData.append(
				"Certification_technicalmanager_freighter",
				await compressImage(await dataUrlToFile(freighterCertificationImage.image, freighterCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (passengerCertificationImage && !passengerCertificationImage.image.includes("http"))
			formData.append(
				"Certification_technicalmanager_passenger",
				await compressImage(await dataUrlToFile(passengerCertificationImage.image, passengerCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (formState === "ADD") registerTechnicalManagerFn(formData);
		else updateTechnicalManagerRoleDataFn(formData);
	};

	const setFormData = (data: TechnicalManagerRoleData) => {
		reset({
			national_code: data.user.personal.national_code,
			phone: data.user.personal.phone,
			...data,
		});

		const imageFreighter = data.user.images?.find((image) => image.image_type === "freighter");
		const imagePassenger = data.user.images?.find((image) => image.image_type === "passenger");

		if (imageFreighter)
			setFreighterCertificationImage({
				image: STORAGE_URL + imageFreighter.url,
				name: "عکس گواهی بازدید باری",
				id: imageFreighter.id,
				user_id: imageFreighter.user_id,
			});

		if (imagePassenger)
			setPassengerCertificationImage({
				image: STORAGE_URL + imagePassenger.url,
				name: "عکس گواهی بازدید مسافری",
				id: imagePassenger.id,
				user_id: imagePassenger.user_id,
			});
	};

	const handleImageSelectFreighterCertification = () => {
		if (freighterCertificationInput.current.files[0]?.type.match(/^image\/(jpeg|png|webp)$/)) {
			setFreighterCertificationImage({
				image: URL.createObjectURL(freighterCertificationInput.current.files[0]),
				name: freighterCertificationInput.current.files[0].name,
			});
		} else freighterCertificationInput.current.value = null;
	};

	const handleImageSelectPassengerCertification = () => {
		if (passengerCertificationInput.current.files[0]?.type.match(/^image\/(jpeg|png|webp)$/)) {
			setPassengerCertificationImage({
				image: URL.createObjectURL(passengerCertificationInput.current.files[0]),
				name: passengerCertificationInput.current.files[0].name,
			});
		} else passengerCertificationInput.current.value = null;
	};

	const handleRemoveFreighterCertificationImage = () => {
		if (freighterCertificationImage.id)
			deleteTechnicalManagerCertificateFn({ id: freighterCertificationImage.id, user_id: freighterCertificationImage.user_id });
		else setFreighterCertificationImage(null);
	};

	const handleRemovePassengerCertificationImage = () => {
		if (passengerCertificationImage.id)
			deleteTechnicalManagerCertificateFn({ id: passengerCertificationImage.id, user_id: passengerCertificationImage.user_id });
		else setPassengerCertificationImage(null);
	};

	useEffect(() => {
		if (errors.national_code?.type === "pattern") setTimeout(() => clearErrors("national_code"), 3000);
	}, [errors.national_code]);

	useEffect(() => {
		if (errors.phone?.type === "pattern") setTimeout(() => clearErrors("phone"), 3000);
	}, [errors.phone]);

	useEffect(() => {
		if (errors.capacity?.type === "pattern") setTimeout(() => clearErrors("capacity"), 3000);
	}, [errors.capacity]);

	useEffect(() => {
		if (errors.freighter_capacity?.type === "pattern") setTimeout(() => clearErrors("freighter_capacity"), 3000);
	}, [errors.freighter_capacity]);

	useEffect(() => {
		if (errors.passenger_capacity?.type === "pattern") setTimeout(() => clearErrors("passenger_capacity"), 3000);
	}, [errors.passenger_capacity]);

	useEffect(() => {
		switch (type) {
			case 1:
				setPassengerCertificationImage(null);
				break;

			case 2:
				setFreighterCertificationImage(null);
				break;
		}

		if (type !== 3) {
			resetField("freighter_capacity");
			resetField("passenger_capacity");
		}
	}, [type]);

	useEffect(() => {
		if (formState === "EDIT" && technicalManagerRoleData.isSuccess) setFormData(technicalManagerRoleData.data.data);
	}, [formState, technicalManagerRoleData.isSuccess, technicalManagerRoleData.data]);

	useEffect(() => {
		if (type === 3) {
			trigger("freighter_capacity");
			trigger("passenger_capacity");
		}
	}, [capacity, freighter_capacity, passenger_capacity, type]);

	useEffect(() => {
		if (updateTechnicalManagerRoleDataResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: updateTechnicalManagerRoleDataResult.data.message,
			});

			reset({
				national_code: updateTechnicalManagerRoleDataResult.data.data.user.personal.national_code,
				phone: updateTechnicalManagerRoleDataResult.data.data.user.personal.phone,
				...updateTechnicalManagerRoleDataResult.data.data,
			});

			const imageFreighter = updateTechnicalManagerRoleDataResult.data.data.user.images?.find((image) => image.image_type === "freighter");
			const imagePassenger = updateTechnicalManagerRoleDataResult.data.data.user.images?.find((image) => image.image_type === "passenger");

			if (imageFreighter)
				setFreighterCertificationImage({
					image: STORAGE_URL + imageFreighter.url,
					name: "عکس گواهی بازدید باری",
					id: imageFreighter.id,
					user_id: imageFreighter.user_id,
				});

			if (imagePassenger)
				setPassengerCertificationImage({
					image: STORAGE_URL + imagePassenger.url,
					name: "عکس گواهی بازدید مسافری",
					id: imagePassenger.id,
					user_id: imagePassenger.user_id,
				});
		}
	}, [updateTechnicalManagerRoleDataResult.isSuccess, updateTechnicalManagerRoleDataResult.data]);

	useEffect(() => {
		if (registerTechnicalManagerResult.isSuccess) navigate("/dashboard");
	}, [registerTechnicalManagerResult.isSuccess]);

	useEffect(() => {
		if (deleteTechnicalManagerCertificateResult.isSuccess) {
			if (deleteTechnicalManagerCertificateResult.data.data.image_type === "freighter") setFreighterCertificationImage(null);
			else if (deleteTechnicalManagerCertificateResult.data.data.image_type === "passenger") setPassengerCertificationImage(null);
		}
	}, [deleteTechnicalManagerCertificateResult.isSuccess, deleteTechnicalManagerCertificateResult.data]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-5"
		>
			<Controller
				name="type"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<FormControl
						required
						className="lg:col-start-1 lg:col-end-6"
					>
						<FormLabel
							id="type-label"
							required
						>
							حوزه فعالیت
						</FormLabel>
						<RadioGroup
							{...field}
							onChange={(event) => field.onChange(Number(event.target.value))}
							defaultValue={1}
						>
							<FormControlLabel
								value={1}
								label="باری"
								control={<Radio />}
							/>
							<FormControlLabel
								value={2}
								label="مسافری"
								control={<Radio />}
							/>
							<FormControlLabel
								value={3}
								label="باری و مسافری"
								control={<Radio />}
							/>
						</RadioGroup>
					</FormControl>
				)}
			/>
			<TextField
				{...register("national_code")}
				label="کد ملی"
				type="tel"
				error={!!errors.national_code}
				helperText={errors.national_code?.message ?? ""}
				placeholder="کد ملی را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("national_code", { message: "کد ملی نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 10);

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT" || !!nationalCode}
				required
				fullWidth
			/>
			<TextField
				{...register("phone")}
				label="شماره همراه"
				type="tel"
				error={!!errors.phone}
				helperText={errors.phone?.message ?? ""}
				placeholder="شماره همراه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("phone", { message: "شماره همراه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 11);

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
				disabled
			/>
			<TextField
				{...register("capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش روزانه"
				type="number"
				dir="ltr"
				error={!!errors.capacity}
				helperText={errors.capacity?.message ?? ""}
				placeholder="حداکثر پذیرش روزانه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("capacity", { message: "حداکثر پذیرش روزانه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			<TextField
				{...register("freighter_capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش باری"
				type="number"
				dir="ltr"
				error={!!errors.freighter_capacity}
				helperText={errors.freighter_capacity?.message ?? ""}
				placeholder="حداکثر پذیرش باری را وارد کنید"
				autoComplete="off"
				hidden={type !== 3}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("freighter_capacity", { message: "حداکثر پذیرش باری نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("passenger_capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش مسافری"
				type="number"
				dir="ltr"
				error={!!errors.passenger_capacity}
				helperText={errors.passenger_capacity?.message ?? ""}
				placeholder="حداکثر پذیرش مسافری را وارد کنید"
				autoComplete="off"
				hidden={type !== 3}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("passenger_capacity", { message: "حداکثر پذیرش مسافری نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				fullWidth
			/>
			{(type === 1 || type === 3) && (
				<>
					<div
						className="relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg h-32 cursor-pointer border-primary-dark overflow-hidden lg:col-start-1"
						onClick={() => freighterCertificationInput.current.click()}
					>
						{freighterCertificationImage ? (
							<>
								<ImageComponent
									image={freighterCertificationImage.image}
									alt={freighterCertificationImage.name}
									stopPropagation={true}
								/>
								<IconButton
									className="absolute bottom-2 right-2 text-red-500 bg-red-200/30"
									onClick={(event) => {
										event.stopPropagation();
										handleRemoveFreighterCertificationImage();
									}}
								>
									<Trash size="24" />
								</IconButton>
							</>
						) : (
							<>
								<Image
									size="32"
									color="#00be77"
								/>
								<h4>عکس گواهی بازدید باری (اختیاری)</h4>
							</>
						)}
					</div>
					<input
						ref={freighterCertificationInput}
						type="file"
						className="hidden"
						id="Certification_technicalmanager_freighter"
						name="Certification_technicalmanager_freighter"
						accept="image/jpeg, image/png, image/webp"
						capture="environment"
						onInput={handleImageSelectFreighterCertification}
					/>
				</>
			)}
			{(type === 2 || type === 3) && (
				<>
					<div
						className={
							"relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg h-32 cursor-pointer border-primary-dark overflow-hidden" +
							(type !== 3 ? " col-start-1" : "")
						}
						onClick={() => passengerCertificationInput.current.click()}
					>
						{passengerCertificationImage ? (
							<>
								<ImageComponent
									image={passengerCertificationImage.image}
									alt={passengerCertificationImage.name}
									stopPropagation={true}
									orientation="horizontal"
								/>
								<IconButton
									className="absolute bottom-2 right-2 text-red-500 bg-red-200/30"
									onClick={(event) => {
										event.stopPropagation();
										handleRemovePassengerCertificationImage();
									}}
								>
									<Trash size="24" />
								</IconButton>
							</>
						) : (
							<>
								<Image
									className="object-contain"
									size="32"
									color="#00be77"
								/>
								<h4>عکس گواهی بازدید مسافری (اختیاری)</h4>
							</>
						)}
					</div>
					<input
						ref={passengerCertificationInput}
						type="file"
						className="hidden"
						name="Certification_technicalmanager_passenger"
						id="Certification_technicalmanager_passenger"
						accept="image/jpeg, image/png, image/webp"
						capture="environment"
						onInput={handleImageSelectPassengerCertification}
					/>
				</>
			)}
			<Button
				className="lg:row-start-4 lg:h-fit"
				variant="contained"
				type="submit"
				size="large"
				loading={registerTechnicalManagerResult.isLoading || updateTechnicalManagerRoleDataResult.isLoading}
				fullWidth
			>
				{formState === "ADD" ? "استعلام مدیر فنی" : "ویرایش اطلاعات مدیر فنی"}
			</Button>
		</form>
	);
};

export default TechnicalManagerForm;
