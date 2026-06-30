import React, { useMemo } from "react";
import NewFleet from "../../../components/Fleet/NewFleet";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../Stores/hooks";

const AddEditDriverFleet = () => {
	const { id } = useParams();

	const isIdExist = useMemo<boolean>(() => (id === null || id === undefined || id === "" || id === "0" ? false : true), [id]);	
	return (
		<NewFleet
			owner="me"
			mode={isIdExist ? "EDIT" : "ADD"}
			id={isIdExist ? +id : 0}
		/>
	);
};

export default AddEditDriverFleet;
