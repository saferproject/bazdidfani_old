import { FaPlus } from "react-icons/fa";
import { Button, Fab } from "@mui/material";
import FleetList from "../../../components/Fleet/FleetList";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Add, Truck } from "iconsax-reactjs";

const CompanyFleetList = () => {
	const navigate = useNavigate();

	const handleClickAdd = useCallback(() => {
		navigate(`0`);
	}, [navigate]);

	return (
		<div className="flex flex-col">
			<div className="md:flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<Truck
						size="32"
						className="text-primary"
					/>
					<h2 className="font-bold text-xl md:block">ناوگان شرکت</h2>
				</div>
				<Button
					variant="contained"
					color="primary"
					size="large"
					startIcon={<Add size="24" />}
					className="hidden md:flex"
					onClick={handleClickAdd}
				>
					افزودن ناوگان
				</Button>
			</div>
			<Fab
				size="medium"
				color="primary"
				className="fixed bottom-8 right-8 md:hidden"
				onClick={handleClickAdd}
			>
				<FaPlus />
			</Fab>
			<FleetList owner="company" />
		</div>
	);
};

export default CompanyFleetList;
