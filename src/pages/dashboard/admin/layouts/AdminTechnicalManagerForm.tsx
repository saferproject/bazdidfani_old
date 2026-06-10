import { FC, useEffect, useRef, useState } from "react";
import AdminTechnicalManagerFormProps from "../interfaces/admin-technical-manager-form-porps.interface";
import { Controller, useForm, useWatch } from "react-hook-form";
import TechnicalManagerFormSchema, { TechnicalManagerFormType } from "../../../RoleAssignment/schemas/technical-manager-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CertificateImage from "../../../RoleAssignment/interfaces/certificate-image.interface";
import { dataUrlToFile } from "../../../../utilities/dataURLToFile";
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import ImageComponent from "../../../../components/shared/Image/Image";
import { Trash, Image } from "iconsax-reactjs";
import TechnicalManagerRoleData from "../../../RoleAssignment/interfaces/technical-manager-role-data.interface";
import { useDeleteTechnicalManagerCertificateMutation } from "../../../RoleAssignment/api/role-assignment.api";
import { useAddAdminTechnicalManagerMutation, useEditAdminTechnicalManagerMutation } from "../api/admin-technical-manager.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { STORAGE_URL } from "../../../../Stores/api-urls";
import { compressImage } from "../../../../utilities/compress-image";

const AdminTechnicalManagerForm: FC<AdminTechnicalManagerFormProps> = ({
	formState,
	formData,
	onSubmitTechnicalManager,
	onCancelAddTechnicalManager,
	onCancelEditTechnicalManager,
}) => {
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
	} = useForm<TechnicalManagerFormType>({
		defaultValues: { type: 1 },
		resolver: zodResolver(TechnicalManagerFormSchema),
		mode: "onBlur",
	});

	const { capacity, freighter_capacity, passenger_capacity, type } = useWatch<TechnicalManagerFormType>({ control });

	const [addTechnicalManagerFn, addTechnicalManagerResult] = useAddAdminTechnicalManagerMutation();
	const [editTechnicalManagerFn, editTechnicalManagerResult] = useEditAdminTechnicalManagerMutation();
	const [deleteTechnicalManagerCertificateFn] = useDeleteTechnicalManagerCertificateMutation();

	const onSubmit = async (data: TechnicalManagerFormType) => {
		const newFormData = new FormData();

		for (const key in data) newFormData.append(key, data[key]);

		// ? چون به عکس های روی سرور دسترسی در کد نداریم شرط دوم را گذاشتم
		if (
			freighterCertificationImage &&
			!freighterCertificationImage.image.includes("https://api.bazdidfani.ir/storage/") &&
			!freighterCertificationImage.image.includes("https://test-backend.bazdidfani.ir/storage/")
		)
			newFormData.append(
				"Certification_technicalmanager_freighter",
				await compressImage(await dataUrlToFile(freighterCertificationImage.image, freighterCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (
			passengerCertificationImage &&
			!passengerCertificationImage.image.includes("https://api.bazdidfani.ir/storage/") &&
			!passengerCertificationImage.image.includes("https://test-backend.bazdidfani.ir/storage/")
		)
			newFormData.append(
				"Certification_technicalmanager_passenger",
				await compressImage(await dataUrlToFile(passengerCertificationImage.image, passengerCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (formData) newFormData.append("user_id", String(formData.user_id));

		// TODO: add submittion functions here
		if (formState === "ADD") addTechnicalManagerFn(newFormData);
		else editTechnicalManagerFn(newFormData);
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
		if (formState === "EDIT" && formData) setFormData(formData);
	}, [formState, formData]);

	useEffect(() => {
		if (type === 3) {
			trigger("freighter_capacity");
			trigger("passenger_capacity");
		}
	}, [capacity, freighter_capacity, passenger_capacity, type]);

	useEffect(() => {
		if (addTechnicalManagerResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: addTechnicalManagerResult.data.message,
			});

			onSubmitTechnicalManager();
		}
	}, [addTechnicalManagerResult.isSuccess, addTechnicalManagerResult.data]);

	useEffect(() => {
		if (editTechnicalManagerResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: editTechnicalManagerResult.data.message,
			});

			onSubmitTechnicalManager();
		}
	}, [editTechnicalManagerResult.isSuccess, editTechnicalManagerResult.data]);

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
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
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
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
				required
				fullWidth
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
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			{type === 3 && (
				<TextField
					{...register("freighter_capacity", { valueAsNumber: true })}
					label="حداکثر پذیرش باری"
					type="number"
					dir="ltr"
					error={!!errors.freighter_capacity}
					helperText={errors.freighter_capacity?.message ?? ""}
					placeholder="حداکثر پذیرش باری را وارد کنید"
					autoComplete="off"
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
						inputLabel: {
							shrink: true,
						},
					}}
					fullWidth
				/>
			)}
			{type === 3 && (
				<TextField
					{...register("passenger_capacity", { valueAsNumber: true })}
					label="حداکثر پذیرش مسافری"
					type="number"
					dir="ltr"
					error={!!errors.passenger_capacity}
					helperText={errors.passenger_capacity?.message ?? ""}
					placeholder="حداکثر پذیرش مسافری را وارد کنید"
					autoComplete="off"
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
			)}
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
								<h4>افزودن عکس گواهی بازدید باری</h4>
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
								<h4>افزودن عکس گواهی بازدید مسافری</h4>
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
				variant="outlined"
				color="secondary"
				onClick={formState === "ADD" ? onCancelAddTechnicalManager : onCancelEditTechnicalManager}
			>
				انصراف
			</Button>
			<Button
				className="lg:row-start-4 lg:h-fit"
				variant="contained"
				type="submit"
				size="large"
				loading={addTechnicalManagerResult.isLoading || editTechnicalManagerResult.isLoading}
				fullWidth
			>
				{formState === "ADD" ? "افزودن مدیر فنی" : "ویرایش اطلاعات مدیر فنی"}
			</Button>
		</form>
	);
};

export default AdminTechnicalManagerForm;
