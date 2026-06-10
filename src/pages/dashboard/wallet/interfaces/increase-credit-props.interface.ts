import pageStates from "../types/page-states.type";

export default interface IncreaseCreditProps {
	setStatus: React.Dispatch<React.SetStateAction<pageStates>>;
}