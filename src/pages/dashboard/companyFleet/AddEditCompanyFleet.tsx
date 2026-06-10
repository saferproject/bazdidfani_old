import React, { useMemo } from "react";
import NewFleet from "../../../components/Fleet/NewFleet";
import { useParams } from "react-router-dom";

const AddEditCompanyFleet = () => {
	const { id } = useParams();

	const isIdExist = useMemo<boolean>(() => (id === null || id === undefined || id === "" || id === "0" ? false : true), [id]);
	return (
		<NewFleet
			owner="company"
			mode={isIdExist ? "EDIT" : "ADD"}
			id={isIdExist ? +id : 0}
		/>
	);
};

export default AddEditCompanyFleet;
