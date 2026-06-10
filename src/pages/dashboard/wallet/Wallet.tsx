import { Button } from "@mui/material";
import { useState } from "react";
import { GrMoney } from "react-icons/gr";
import IncreaseCredit from "./layouts/IncreaseCredit.layout";
import pageStates from "./types/page-states.type";
import CreditChangesHistory from "./layouts/creditChangesHistory";
import { useGetWalletInfoQuery } from "./api/wallet.api";

const formatValue = (value: string): string => {
	if (value)
		return Number(value)
			.toFixed()
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Wallet() {
	const [status, setStatus] = useState<pageStates>("history");

	const walletInfo = useGetWalletInfoQuery();

	return (
		<div className="md:mt-0  flex flex-col gap-4 overflow-hidden">
			<div className="hidden md:flex flex-row items-center justify-around p-4 bg-primary rounded-2xl">
				<div className="flex flex-row gap-4">
					<div className="flex flex-row items-center justify-center px-2 bg-primary-dark rounded-e-full">
						<GrMoney className="w-16 h-16 text-primary-light" />
					</div>
					<div className="flex flex-col">
						<p className="lg:text-5xl md:text-3xl font-Rokh font-semibold">اطلاعات</p>
						<p className="lg:text-6xl md:text-4xl font-Yekan-Bakh font-black">کیف پول شما</p>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center gap-2 p-4">
					<div className="relative xl:w-[20vw] md:w-[25vw] h-[20vh] rounded-3xl">
						<div className="backdrop-blur-[10px] absolute top-0 right-0 border-4 border-[#75f4c5] z-30! w-full h-full rounded-3xl"></div>
						<div className="bg-white absolute top-0 right-0 border-4 border-[#75f4c5] z-0 w-full h-full rounded-3xl"></div>
						<div className="w-20 h-20 bg-primary-dark rounded-full absolute -top-4 -right-4 z-10"></div>
						<div className="w-12 h-12 bg-primary-dark rounded-full absolute bottom-5 -left-4 z-10"></div>
						<div className="flex flex-col w-full h-full bg-transparent absolute top-0 right-0 z-30 gap-7 items-start p-6">
							<div className="flex flex-row items-center">
								<h3 className="font-semibold xl:text-xl text-sm tracking-tight">موجودی کیف پول</h3>
								<div className="rounded-3xl w-16 h-5 bg-[linear-gradient(50deg,#00eb93_30%,transparent_70%)]"></div>
							</div>
							<div className="flex flex-row items-center gap-2 self-center">
								<h3 className="xl:text-3xl md:text-xl font-bold">{formatValue(walletInfo.data?.data.balance ?? "")}</h3>
								<p className="font-semibold md:text-[0.75rem] xl:text-lg">تومان</p>
							</div>
							<Button
								variant="contained"
								className="flex flex-row gap-2 items-center self-end"
								onClick={() => setStatus("diposit")}
							>
								شارژ کیف پول
							</Button>
						</div>
						<svg
							width="100"
							height="100"
							viewBox="0 0 100 100"
							xmlns="http://www.w3.org/2000/svg"
							className="absolute right-1 bottom-1 rotate-30"
						>
							<path
								d="M -11 103 Q 15 97 15 81 Q 21 41 108 45"
								fill="none"
								stroke="#e0e0e0"
								strokeWidth="1"
							/>
							<path
								d="M 11 102 Q 26 91 27 85 Q 32 54 105 57"
								fill="none"
								stroke="#e0e0e0"
								strokeWidth="1"
							/>
							<path
								d="M 30 100 Q 44 60 106 70"
								fill="none"
								stroke="#e0e0e0"
								strokeWidth="1"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div className="md:hidden flex flex-col items-center justify-center gap-2 p-4">
				<div className="w-[80vw] h-[20vh] relative rounded-3xl">
					<div className="w-20 h-20 bg-primary-dark rounded-full absolute -top-4 -right-4"></div>
					<div className="w-12 h-12 bg-primary-dark rounded-full absolute bottom-5 -left-4"></div>
					<div className="backdrop-blur-[10px] border-4 border-[#75f4c5] z-10 w-full h-full rounded-3xl"></div>
					<div className="bg-white absolute top-0 right-0 border-4 border-[#75f4c5] -z-20 w-full h-full rounded-3xl"></div>
					<div className="flex flex-col w-full h-full absolute top-0 right-0 z-30 gap-4 items-start p-6">
						<div className="flex flex-row items-center">
							<h3 className="font-semibold tracking-tight">موجودی کیف پول</h3>
							<div className="rounded-3xl w-16 h-5 bg-[linear-gradient(50deg,#00eb93_30%,transparent_70%)]"></div>
						</div>
						<div className="flex flex-row items-center gap-2 self-center">
							<h3 className="text-3xl font-bold">{formatValue(walletInfo.data?.data.balance ?? "")}</h3>
							<p className="font-semibold">تومان</p>
						</div>
						<Button
							variant="contained"
							className="flex flex-row gap-2 items-center self-end"
							onClick={() => setStatus("diposit")}
						>
							شارژ کیف پول
						</Button>
					</div>
					<svg
						width="100"
						height="100"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
						className="absolute right-1 bottom-1 rotate-30"
					>
						<path
							d="M -11 103 Q 15 97 15 81 Q 21 41 108 45"
							fill="none"
							stroke="#e0e0e0"
							strokeWidth="1"
						/>
						<path
							d="M 11 102 Q 26 91 27 85 Q 32 54 105 57"
							fill="none"
							stroke="#e0e0e0"
							strokeWidth="1"
						/>
						<path
							d="M 30 100 Q 44 60 106 70"
							fill="none"
							stroke="#e0e0e0"
							strokeWidth="1"
						/>
					</svg>
				</div>
			</div>
			{status === "history" && <CreditChangesHistory />}
			{status === "diposit" && <IncreaseCredit setStatus={setStatus} />}
		</div>
	);
}
