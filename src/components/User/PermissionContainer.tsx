import { Avatar, Button, Checkbox, Divider, FormControlLabel, Radio, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import Menu from "../../assets/images/Menu.svg";
import AddMenu from "../../assets/images/Add-Menu.svg";
import { useAddPermissionMutation, useAllPermissionsQuery, useGetPermissionListQuery } from "../../api/Profile/Profile";
import SkeletonCondition from "../shared/SkeletonCondition";
import { useAddCompanyUserMutation } from "../../api/Company/Users";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Stores/store";
import { removeUserCompanyPersonal, removeUserCompanyRoles } from "../../Stores/slices/user";

interface ICheckBoxBoxes {
	permissionIdArr: number[];
	allPermissionIdArr: number[];
	setAllPerrmissionIdArr: Dispatch<SetStateAction<number[]>>;
	boxTtitle: string;
	availabelPermissionIdsArr: number[];
	FoundPermissionName: (permission_id: number) => any;
	loading: boolean;
}

const CheckBoxBoxes: FC<ICheckBoxBoxes> = ({
	allPermissionIdArr,
	permissionIdArr,
	availabelPermissionIdsArr,
	setAllPerrmissionIdArr,
	boxTtitle,
	FoundPermissionName,
	loading,
}) => {
	return (
		<SkeletonCondition
			loading={loading}
			className="h-[300px]"
		>
			<div className="p-4 border w-full rounded-[14px] flex flex-col gap-4">
				<FormControlLabel
					sx={{
						color: availabelPermissionIdsArr.length === 0 ? "text.disabled" : "#000",
					}}
					className="font-bold text-[14px]"
					disableTypography
					label={boxTtitle}
					control={<Checkbox />}
					disabled={availabelPermissionIdsArr.length === 0}
					checked={!!availabelPermissionIdsArr.find((ele) => allPermissionIdArr.includes(ele))}
					onClick={() => {
						!availabelPermissionIdsArr.find((ele) => allPermissionIdArr.includes(ele))
							? setAllPerrmissionIdArr([...allPermissionIdArr, ...availabelPermissionIdsArr])
							: setAllPerrmissionIdArr(allPermissionIdArr.filter((ele) => !availabelPermissionIdsArr.includes(ele)));
					}}
				/>
				<div className="flex flex-col gap-4">
					{permissionIdArr.map((item) => (
						<FormControlLabel
							sx={{
								color: availabelPermissionIdsArr.includes(item) ? "#000" : "text.disabled",
							}}
							className="font-semibold text-[14px]"
							disableTypography
							label={FoundPermissionName(item)}
							control={<Radio checked={allPermissionIdArr.includes(item)} />}
							onClick={() => {
								if (availabelPermissionIdsArr.includes(item)) {
									allPermissionIdArr.includes(item)
										? setAllPerrmissionIdArr(allPermissionIdArr.filter((ele) => ele !== item))
										: setAllPerrmissionIdArr([...allPermissionIdArr, item]);
								}
							}}
							disabled={!availabelPermissionIdsArr.includes(item)}
						/>
					))}
				</div>
			</div>
		</SkeletonCondition>
	);
};

const PermissionPage = () => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const personal = useSelector((state: RootState) => state.user.userCompanyPersonal);
	const role = useSelector((state: RootState) => state.user.userCompanyRoles);

	const [allPermissionIdArr, setAllPerrmissionIdArr] = useState<number[]>([]);

	const GetpermissionListQuuery = useGetPermissionListQuery();

	const [setPermissionFn, setPermissionResult] = useAddPermissionMutation();
	const [addUserFn, addUserResult] = useAddCompanyUserMutation();

	useEffect(() => {
		setPermissionResult.isSuccess && addUserFn({ user: +searchParams.get("user_id") });
	}, [setPermissionResult, addUserFn, searchParams]);

	useEffect(() => {
		if (addUserResult.isSuccess) {
			navigate("/dashboard/users");
			dispatch(removeUserCompanyPersonal());
			dispatch(removeUserCompanyRoles());
		}
	}, [addUserResult, navigate, dispatch]);

	const isAllSelected = useMemo(() => {
		if (GetpermissionListQuuery.isSuccess && allPermissionIdArr) {
			const arr1 = GetpermissionListQuuery.data.data.map((ele: any) => ele.permission_id).sort((a: number, b: number) => a - b);
			const arr2 = [...allPermissionIdArr].sort((a, b) => a - b);
			return arr1.length === arr2.length && arr1.every((value: number, index: number) => value === arr2[index]);
		}
		return false;
	}, [allPermissionIdArr, GetpermissionListQuuery]);

	const getAvailableIds = useCallback(
		(ids: number[]) => {
			const arr: number[] = [];
			if (GetpermissionListQuuery.isSuccess) {
				ids.map((id) => {
					GetpermissionListQuuery.data.data.map((ele: any) => ele.permission_id).includes(id) && arr.push(id);
				});
			}
			return arr;
		},
		[GetpermissionListQuuery]
	);

	const GetAllPermissions = useAllPermissionsQuery();

	const FoundPermissionName = useCallback(
		(permission_id: number) => {
			if (GetAllPermissions.isSuccess) {
				const foundedPermission = GetAllPermissions.data.data.find((item: any) => item.id === permission_id);
				return foundedPermission ? foundedPermission.description : "";
			}
			return "";
		},
		[GetAllPermissions]
	);

	return (
		<div className="flex flex-col gap-8">
			<h2 className="font-bold text-xl">ایجاد دسترسی ها</h2>
			<div className="flex items-center gap-4">
				<TextField label="یک عنوان نقش ایجاد کنید" />
				<FormControlLabel
					className="font-semibold text-slate-600 text-[14px]"
					disableTypography
					label="انتخاب همه دسترسی ها"
					control={<Checkbox checked={isAllSelected} />}
					onClick={() => {
						isAllSelected
							? setAllPerrmissionIdArr([])
							: setAllPerrmissionIdArr(GetpermissionListQuuery.data?.data.map((ele: any) => ele.permission_id));
					}}
				/>
				<div className="flex">
					<Button
						onClick={() => {
							setAllPerrmissionIdArr([]);
						}}
						variant="contained"
						color="error"
						sx={{
							minWidth: 40,
							height: 35,
							padding: 0,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 0,
							boxShadow: "none",
							borderTopLeftRadius: 7,
							borderBottomLeftRadius: 7,
							backgroundColor: "#ef4444",
							color: "white",
						}}
					>
						<AiOutlineDelete size={20} />
					</Button>
					<div className="flex justify-center items-center h-[35px] px-2 bg-red-400 rounded-l-[7px]">
						<Typography
							variant="caption"
							color="white"
							fontWeight={500}
						>
							حذف همه ی دسترسی ها
						</Typography>
					</div>
				</div>
			</div>
			<div className="flex gap-8">
				<div className="flex flex-col gap-4 w-1/2">
					{[
						[18, 19, 20, 21, 22, 23],
						[24, 25, 26, 27, 28, 29],
						// [20, 21, 22, 23, 24, 25],
						// [26, 27, 28, 29, 30, 31],
						// [32, 33, 34, 35, 36, 37],
						// [38, 39, 40, 41, 42, 43],
						// [44, 45],
					].map((ele, index) => (
						<CheckBoxBoxes
							key={index}
							allPermissionIdArr={allPermissionIdArr}
							boxTtitle="گروه دسترسی ها"
							permissionIdArr={ele}
							availabelPermissionIdsArr={getAvailableIds(ele)}
							setAllPerrmissionIdArr={setAllPerrmissionIdArr}
							FoundPermissionName={FoundPermissionName}
							loading={
								GetpermissionListQuuery.isLoading ||
								GetpermissionListQuuery.isFetching ||
								GetAllPermissions.isLoading ||
								GetAllPermissions.isFetching
							}
						/>
					))}
				</div>
				<div
					className="rounded-[18px] px-4 py-7 bg-[#f6f7f8] flex flex-col gap-10"
					style={{
						backgroundImage: `repeating-linear-gradient(
                  to right,
                  #bfccd9 0,
                  #bfccd9 15px,
                  transparent 15px,
                  transparent 20px
                ),
                repeating-linear-gradient(
                  to right,
                  #bfccd9 0,
                  #bfccd9 15px,
                  transparent 15px,
                  transparent 20px
                ),
                repeating-linear-gradient(
                  to bottom,
                  #bfccd9 0,
                  #bfccd9 15px,
                  transparent 15px,
                  transparent 20px
                ),
                repeating-linear-gradient(
                  to bottom,
                  #bfccd9 0,
                  #bfccd9 15px,
                  transparent 15px,
                  transparent 20px
                )`,
						backgroundPosition: "left top, left bottom, left top, right top",
						backgroundSize: "100% 1px, 100% 1px, 1px 100%, 1px 100%",
						backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
					}}
				>
					<div className="flex gap-3 items-center">
						<div
							style={{
								borderColor: theme.palette.primary.main,
								borderRadius: "120px 120px 200px 200px",
							}}
							className={`flex gap-3 border-2 h-[27px] w-[27px]`}
						></div>
						<Typography
							variant="body2"
							className="font-semibold text-[#96a8ba] text-[17px]"
						>
							ایجاد سطح دسترسی به کاربر
						</Typography>
					</div>
					<div className="w-full flex justify-center">
						<div
							style={{
								borderColor: theme.palette.primary.main,
							}}
							className="w-[287px] h-[95px] bg-[#97a8b9] rounded-[25px] border-b-2 p-4 flex justify-between items-center"
						>
							<div className="flex flex-col h-full justify-between">
								<p className="text-white text-[20px] font-extrabold">{personal?.full_name}</p>
								<p className="text-white text-[14px]">کاربری فعلی : {role.map((ele) => ele.description).join(" , ")}</p>
							</div>
							<Avatar
								src="https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg"
								sx={{ width: 70, height: 70 }}
								className="border-4 border-[#f6f7f8]"
							/>
						</div>
					</div>
					<div className="w-full flex flex-col gap-8">
						<div className="flex items-center justify-evenly">
							<div className="flex flex-col gap-2 items-center">
								<div className="flex w-full gap-5 items-center">
									<div
										style={{
											backgroundColor: theme.palette.primary.main,
										}}
										className="w-[33px] h-[33px] rounded-r-[16px] rounded-b-[16px] p-2"
									>
										<img
											src={Menu}
											alt="Menu"
										/>
									</div>
									<p className="text-[34px] font-bold ">{GetpermissionListQuuery?.data?.data?.length || 0}</p>
								</div>
								<p className="text-[15px] font-bold">تعداد کل امکانات</p>
							</div>
							<Divider
								orientation="vertical"
								flexItem
							/>
							<div className="flex flex-col gap-2 items-center">
								<div className="flex w-full gap-5 items-center">
									<div
										style={{
											backgroundColor: theme.palette.primary.main,
										}}
										className="w-[33px] h-[33px] rounded-r-[16px] rounded-b-[16px] p-2"
									>
										<img
											src={AddMenu}
											alt="AddMenu"
										/>
									</div>
									<p className="text-[34px] font-bold ">{allPermissionIdArr.length}</p>
								</div>
								<p className="text-[15px] font-bold">سطح دسترسی ها</p>
							</div>
						</div>
						<Divider />
					</div>
					<div className="flex flex-col gap-5">
						<p className="text-[15px] text-[#96a8ba] font-semibold mb-4">لیست سطح دسترسی ها</p>
						{allPermissionIdArr.map((ele, index) => (
							<div
								className="flex gap-3 items-baseline"
								key={index}
							>
								<div
									style={{
										backgroundColor: theme.palette.primary.main,
									}}
									className="rounded-full w-[8px] h-[8px]"
								></div>
								<p className="text-[14px] font-semibold">{FoundPermissionName(ele)}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="flex gap-4">
				<Button
					variant="outlined"
					color="secondary"
					className="flex items-center justify-between"
					endIcon={<IoClose />}
					onClick={() => {
						navigate("/dashboard/users");
					}}
				>
					انصراف
				</Button>
				<Button
					variant="contained"
					loading={setPermissionResult.isLoading || addUserResult.isLoading}
					endIcon={<GoArrowLeft />}
					className="flex items-center justify-between"
					onClick={() => {
						setPermissionFn({
							permissions: allPermissionIdArr,
							user_id: searchParams.get("user_id")!,
						});
					}}
				>
					ثبت
				</Button>
			</div>
		</div>
	);
};

export default PermissionPage;
