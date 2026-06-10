import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { FC, useEffect } from "react";
import NumericInput from "../../../../components/shared/Inputs/NumericInput";
import { Controller, useForm } from "react-hook-form";
import IncreaseCreditForm from "../interfaces/increase-credit-form.interface";
import IncreaseCreditProps from "../interfaces/increase-credit-props.interface";
import { useIncreaseCreditMutation } from "../api/wallet.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { InfoCircle } from "iconsax-reactjs";
import ParsianLogo from "../../../../assets/images/pec-logo.png";
import MellatLogo from "../../../../assets/images/behpardakht_logo.svg";
import { useAdminSaveLogMutation } from "../../admin/api/admin-logs.api";

const IncreaseCredit: FC<IncreaseCreditProps> = () => {
	const { control, setValue, setFocus, getValues, trigger } = useForm<IncreaseCreditForm>({ defaultValues: { dargah: "parsian" } });

	const [increaseCreditFn, increaseCreditResult] = useIncreaseCreditMutation();

	const handleSetValue = (value: number) => {
		try {
			setValue("price", value);
		} catch (error) {
			SweetAlertToast.fire({
				icon: "error",
				title: "خطا در تنظیم مقدار",
				text: "لطفاً دوباره تلاش کنید.",
			});
		}
	};

	const handleSubmit = async () => {
		try {
			const isValid = await trigger("price");

			if (!isValid) return;

			increaseCreditFn(getValues());
		} catch (error) {
			SweetAlertToast.fire({
				icon: "error",
				title: "خطا در ارسال درخواست",
				text: "لطفاً دوباره تلاش کنید.",
			});
		}
	};

	useEffect(() => {
		if (increaseCreditResult.isSuccess && increaseCreditResult.data) {
			const link = document.createElement("a");
			link.href = increaseCreditResult.data.data.payment_url;
			link.click();
		}
	}, [increaseCreditResult.isSuccess, increaseCreditResult.data]);

	return (
		<>
			<Divider>
				<p className="font-Yekan-Bakh font-semibold px-8 md:text-2xl">شارژ کیف پول</p>
			</Divider>
			<div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl">
				<h3 className="font-Yekan-Bakh text-sm text-gray-500">مبالغ پیشنهادی</h3>
				<div className="xl:w-1/3 flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div
							className="text-center w-1/3 bg-gray-200 border border-dashed p-2 rounded-lg cursor-pointer"
							onClick={() => handleSetValue(10000)}
						>
							<p>10,000</p>
						</div>
						<div
							className="text-center w-1/3 bg-gray-200 border border-dashed p-2 rounded-lg cursor-pointer"
							onClick={() => handleSetValue(100000)}
						>
							<p>100,000</p>
						</div>
						<div
							className="text-center w-1/3 bg-gray-200 border border-dashed p-2 rounded-lg cursor-pointer"
							onClick={() => handleSetValue(200_000)}
						>
							<p>200,000</p>
						</div>
					</div>
					<NumericInput
						name="price"
						control={control}
						setValue={setValue}
						setFocus={setFocus}
						getValue={getValues}
						defaultValue={5_000}
						step={1_000}
						min={5_000}
						max={10_000_000}
						rules={{
							required: "مبلغ شارژ الزامی است",
							min: { value: 5_000, message: "حداقل مبلغ شارژ 5,000 تومان است" },
							max: { value: 10_000_000, message: "حداکثر مبلغ شارژ 10,000,000 تومان است" },
						}}
					/>
				</div>
				<Controller
					control={control}
					name="dargah"
					render={({ field }) => (
						<FormControl>
							<FormLabel className="my-4">انتخاب درگاه پرداخت</FormLabel>
							<RadioGroup {...field}>
								<div className="flex items-center gap-8">
									<div className="flex flex-col items-center gap-2">
										<div className="w-24 h-24 object-cover">
											<img
												src={ParsianLogo}
												alt="تجارت الکترونیک پارسیان"
											/>
										</div>
										<FormControlLabel
											value="parsian"
											control={<Radio />}
											label="پارسیان"
										/>
									</div>
									<div className="flex flex-col items-center gap-2">
										<div className="w-24 h-24 object-cover">
											<img
												src={MellatLogo}
												alt="به پرداخت ملت"
											/>
										</div>
										<FormControlLabel
											value="mellat"
											control={<Radio />}
											label="ملت"
											disabled={true}
										/>
									</div>
								</div>
							</RadioGroup>
						</FormControl>
					)}
				/>
				<div className="flex gap-2">
					<InfoCircle
						size="20"
						className="text-blue-500"
					/>
					<p className="text-gray-500 text-sm">اگر از وی پی ان استفاده می کنید قبل از شارژ آن را غیر فعال کنید</p>
				</div>
				<Button
					className="w-full lg:w-fit"
					variant="contained"
					onClick={handleSubmit}
					loading={increaseCreditResult.isLoading}
				>
					انتقال به درگاه بانک
				</Button>
			</div>
		</>
	);
};

export default IncreaseCredit;
