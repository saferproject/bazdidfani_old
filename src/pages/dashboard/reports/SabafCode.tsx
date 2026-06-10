import { FC, useEffect } from "react";
import SabafCodeProps from "./interfaces/sabaf-code-props.interface";
import { Button } from "@mui/material";
import { useGetSabafTechnicalInspectionMutation } from "../../../api/reports/reports";

const SabafCode: FC<SabafCodeProps> = ({ data, onSuccess }) => {
	const [getSabafTechnicalInspection, sabafTechnicalInspectionResult] = useGetSabafTechnicalInspectionMutation();

	const handleGetTechnicalInspectionSabaf = ({ technical_inspection: { technical_inspection_id } }) =>
		getSabafTechnicalInspection({ technical_inspection_id });

	useEffect(() => {
		if (sabafTechnicalInspectionResult.isSuccess) onSuccess();
	}, [sabafTechnicalInspectionResult.isSuccess]);

	return sabafTechnicalInspectionResult.data || data?.technical_inspection.sabaf_code ? (
		<div className="flex flex-col items-center">
			<div className="flex items-center">
				<p>{sabafTechnicalInspectionResult.data?.data.sabaf_code ?? data?.technical_inspection.sabaf_code}</p>
			</div>
		</div>
	) : (
		<Button
			variant="contained"
			size="small"
			color="primary"
			loading={sabafTechnicalInspectionResult.isLoading}
			onClick={() => handleGetTechnicalInspectionSabaf(data)}
			fullWidth
		>
			دریافت کد رهگیری
		</Button>
	);
};

export default SabafCode;
