import { useSelector } from "react-redux";
import { RootState } from "../../../../Stores/store";

export default function useHavePermission(inputPermission: string) {
  return useSelector((state: RootState) =>
    state.user.roles.some((role) => role.name === inputPermission),
  );
}
