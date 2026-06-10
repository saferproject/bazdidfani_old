import { Button, Fab } from "@mui/material";
import DriverList from "../../../components/Driver/DriverList";
import { useNavigate } from "react-router-dom";
import { Add, UserSquare } from "iconsax-reactjs";

export default function Drivers() {
	const navigate = useNavigate();
	const handleClickAdd = () => {
		navigate("/dashboard/drivers/add-driver?mode=ADD");
	};

	return (
		<div className="flex flex-col gap-y-8">
			<div className="md:flex items-center justify-between hidden">
				<div className="flex items-center gap-4">
					<UserSquare
						size="32"
						className="text-primary"
					/>
					<h2 className="font-extrabold">رانندگان</h2>
				</div>
				<Button
					size="large"
					color="primary"
					variant="contained"
					startIcon={<Add size="24" />}
					className="hidden lg:flex"
					onClick={handleClickAdd}
				>
					افزودن راننده
				</Button>
			</div>
			<Fab
				size="medium"
				color="primary"
				className="fixed bottom-8 right-8"
				onClick={handleClickAdd}
			>
				<Add size="32" />
			</Fab>
			<DriverList />
		</div>
	);
}
