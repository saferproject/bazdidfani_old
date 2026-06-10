import { Divider } from "@mui/material";
import { CgArrowBottomLeft, CgArrowTopRight } from "react-icons/cg";
import { NoteText, Timer1, Wallet1 } from "iconsax-reactjs";
import { GetShamsiDateTime } from "../../utilities/DateTime";

export default function WalletCard({ data }: { data: Record<string, any> }) {
	const formatValue = (value: string): string => {
		if (value)
			return Number(value)
				.toFixed()
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	// {
	//    "id": 6,
	//    "wallet_id": 3,
	//    "order_code": "3201380631",
	//    "status_code": "200",
	//    "status_title": "برداشت موفق",
	//    "price": "500.00",
	//    "transaction_type": "2",
	//    "description": null,
	//    "created_at": "2025-07-14T11:30:31.000000Z",
	//    "updated_at": "2025-07-14T11:30:31.000000Z"
	// },
	return (
		<div className="rounded-2xl w-full p-0 flex flex-col border border-[#e5ecf0]">
			<div className="flex flex-row items-center justify-between bg-[#8da2bf] rounded-t-2xl p-2 px-4">
				<h4 className="font-Yekan-Bakh font-semibold text-[0.8rem] text-white tracking-tight">
					{data.transaction_type === "1" ? "شارژ کیف پول" : "برداشت از کیف پول"}
				</h4>
				{data.transaction_type === "1" ? (
					<div className="bg-[#6f85a3] p-1 rounded-xl">
						<CgArrowBottomLeft className="w-6 h-6 text-primary" />
					</div>
				) : (
					<div className="bg-[#6f85a3] p-1 rounded-xl">
						<CgArrowTopRight className="w-6 h-6 text-red-600" />
					</div>
				)}
			</div>
			<div className="flex flex-col p-4 gap-2">
				<div className="flex flex-row gap-2 items-center">
					<Wallet1 />
					<div className="w-full flex justify-between items-center">
						<h4 className="font-Yekan-Bakh font-semibold text-[#8398b1]">مبلغ</h4>
						<p className="font-Yekan-Bakh font-bold">{formatValue(data.price)} تومان</p>
					</div>
				</div>
				{/* <div className="flex flex-row gap-1 items-center">
					<Timer1
						size="16"
					/>
					<Divider className="w-5 bg-[#bfcbd8] rotate-90" />
					<div className="flex flex-row gap-1 items-center">
						<Typography className="font-Yekan-Bakh font-semibold text-[#8398b1]">مبلغ</Typography>:
						<Typography className="font-Yekan-Bakh font-bold">{data.settler}</Typography>
					</div>
				</div> */}
				<div className="flex flex-row gap-2 items-center">
					<Timer1 />
					<div className="w-full flex justify-between items-center">
						<h4 className="font-Yekan-Bakh font-semibold text-[#8398b1]">زمان</h4>
						<div className="flex flex-row gap-2 items-center">
							<p className="font-Yekan-Bakh font-bold">
								{GetShamsiDateTime(data.created_at)}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-2 items-center">
					<NoteText />
					<div className="w-full flex justify-between items-center">
						<h4 className="font-Yekan-Bakh font-semibold text-[#8398b1]">توضیحات</h4>
						<p className="font-Yekan-Bakh font-bold">{data.description}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
