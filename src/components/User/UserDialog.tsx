import { Dialog,
  DialogContent,
  Badge,
  IconButton,
  Avatar,
  useTheme,
  Button } from "@mui/material";
import TextField from "../shared/Inputs/SaferTextField";
import { FC, useEffect, useRef, useCallback, useState } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { CgColorPicker } from "react-icons/cg";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { ProfileDataType } from "../../types/ProfileType";
import { useProfileApiMutation } from "../../api/Profile/Profile";
import { useGetCitiesQuery } from "../../api/Categories/Location";
import DatePickerComponent from "../shared/DatePicker/DatePickerComponent";
import CustomeAutoComplete from "../shared/Inputs/CustomeAutoComplete";
import { ConvertFileToUrl, createFormData } from "../../utilities/Helper";
import { useDispatch } from "react-redux";
import { setUserCompanyPersonal, setUserCompanyRoles } from "../../Stores/slices/user";
import { CloseCircle, User } from "iconsax-reactjs";

interface IProps {
	open: boolean;
	onClose: () => void;
	defaultValues: ProfileDataType;
	onSuccess: (data: ProfileDataType) => void;
	isExist: boolean;
}

const UserItemsDialog: FC<IProps> = ({ defaultValues, onClose, open, onSuccess, isExist = false }) => {
	const [imageUrl, setImageUrl] = useState("");
	const dispatch = useDispatch();

	const form = useForm<ProfileDataType>({
		defaultValues: { ...defaultValues },
		mode: "onChange",
	});

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = form;

	const { citySearch, image } = useWatch({ control });

	useEffect(() => {
		image && setImageUrl(ConvertFileToUrl(image[0]));
	}, [image]);

	useEffect(() => {
		reset({ ...defaultValues });
		setImageUrl(defaultValues.image?.url);
	}, [defaultValues, reset]);

	const theme = useTheme();

	const uploadImageRef = useRef<HTMLInputElement>(null);

	const [updateProfileFn, updateProfileResult] = useProfileApiMutation();

	useEffect(() => {
		if (updateProfileResult.isSuccess) {
			onSuccess(updateProfileResult.data.data.data.personal);
			dispatch(setUserCompanyPersonal(updateProfileResult.data.data.data.personal));
			dispatch(
				setUserCompanyRoles(
					updateProfileResult.data.data.roles.map((ele: any) => ({
						name: ele.role.name,
						description: ele.role.description,
					}))
				)
			);
		}
	}, [updateProfileResult, onSuccess, dispatch]);

	const onSubmit = useCallback(
		(data: ProfileDataType) => {
			if (!isExist) {
				const { cities, ...otehr } = data;
				const _Data: any = {
					...otehr,
				};
				_Data.city_id = cities?.uuid;
				const formData = createFormData(_Data);
				if (data.image) {
					formData.delete("image[0]");
					formData.append("image", data.image[0]);
				}
				updateProfileFn(formData);
			} else {
				onSuccess(data);
			}
		},
		[updateProfileFn, isExist, onSuccess]
	);

	const cities = useGetCitiesQuery({
		query: citySearch,
	});

	return (
		<Dialog
			open={open}
			maxWidth="lg"
			fullWidth
			sx={{
				"& .MuiPaper-root": {
					borderRadius: 8,
					maxWidth: 1350,
				},
			}}
			onClose={onClose}
		>
			<DialogContent>
				<FormProvider {...form}>
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}
					>
						<input
							className="hidden"
							type="file"
							{...register("image")}
							ref={(el) => {
								register("image").ref(el); // مقداردهی برای react-hook-form
								uploadImageRef.current = el; // ذخیره در useRef
							}}
						/>
						<div>
							<div className="flex gap-4 items-center justify-between mb-4">
								<div className="flex gap-4 items-center">
									<User
										size="32"
										className="text-primary"
									/>
									<h3 className="font-semibold text-xl">تکمیل اطلاعات کاربر</h3>
								</div>
								<IconButton onClick={onClose}>
									<CloseCircle size="24" className="text-red-500" />
								</IconButton>
							</div>
							<div className="flex flex-col gap-4 lg:grid grid-cols-5">
								<div className="row-span-3 flex items-center justify-center">
									<Badge
										sx={{ width: 96, height: 96 }}
										badgeContent={
											<IconButton
												component="label"
												size="small"
												onClick={() => uploadImageRef.current?.click()}
												disabled={isExist}
											>
												<div
													style={{
														borderColor: theme.palette.primary.main,
													}}
													className={`w-[30px] h-[30px] rounded-full border bg-white flex justify-center items-center`}
												>
													<CgColorPicker className="text-black!" />
												</div>
											</IconButton>
										}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "right",
										}}
									>
										<Avatar
											src={imageUrl}
											sx={{ width: 96, height: 96 }}
										/>
									</Badge>
								</div>
								<TextField
									{...register("full_name")}
									label="نام و نام خانوادگی"
									placeholder="نام و نام خانوادگی به همراه پسوند و پیشوند"
									fullWidth
									InputProps={{
										readOnly: isExist,
									}}
								/>
								<TextField
									{...register("national_code")}
									label="کد ملی"
									placeholder="کدملی را وارد کنید"
									fullWidth
									inputProps={{
										maxLength: 10,
									}}
									InputProps={{
										readOnly: isExist,
									}}
								/>
								<TextField
									{...register("phone")}
									label="شماره همراه"
									placeholder="شماره همراه خود را وارد کنید"
									fullWidth
									inputProps={{
										maxLength: 11,
									}}
									InputProps={{
										readOnly: isExist,
									}}
								/>
								<TextField
									{...register("telephone")}
									label="تلفن"
									placeholder="تلفن ثابت را وارد کنید"
									fullWidth
									inputProps={{
										maxLength: 11,
									}}
									InputProps={{
										readOnly: isExist,
									}}
								/>
								<TextField
									{...register("email")}
									slotProps={{
										input: {
											readOnly: isExist,
										},
									}}
									label="ایمیل"
									fullWidth
									placeholder="ایمیل را وارد کنید"
								/>
								<DatePickerComponent
									control={control}
									label="سال تولد"
									name="birthdate"
									placeholder="سال تولد را انتخاب کنید"
									readOnly={isExist}
								/>
								<CustomeAutoComplete
									showField="name"
									name="cities"
									control={control}
									data={cities.data?.data ?? []}
									setValue={setValue}
									searchName="citySearch"
									label="شهر"
									error={!!errors.city_id}
									helperText={errors.city_id?.message.toString() ?? ""}
									placeholder="شهر محل سکونت را انتخاب کنید"
									loading={cities.isLoading || cities.isFetching}
									readOnly={isExist}
								/>
								<TextField
									{...register("father_name")}
									slotProps={{
										input: {
											readOnly: isExist,
										},
									}}
									label="نام پدر"
									fullWidth
								/>
								<TextField
									{...register("address")}
									slotProps={{
										input: {
											readOnly: isExist,
										},
									}}
									label="آدرس محل سکونت"
									fullWidth
									placeholder="آدرس محل سکونت را به صورت دقیق وارد کنید"
									className="col-start-2 col-end-6"
								/>
								{!isExist && (
									<>
										<TextField
											{...register("password")}
											label="رمز عبور"
											fullWidth
											type="password"
										/>
										<TextField
											{...register("password_confirmation")}
											label="تکرار رمز عبور"
											fullWidth
											type="password"
										/>
									</>
								)}
								<Button
									loading={updateProfileResult.isLoading}
									fullWidth
									variant="contained"
									size="large"
									type="submit"
									className="flex justify-between items-center row-start-4 col-start-5"
									endIcon={<HiArrowNarrowLeft />}
								>
									ثبت اطلاعات کاربر
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};

export default UserItemsDialog;
