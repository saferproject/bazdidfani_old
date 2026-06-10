import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Stores/store";

export default function useHavePermission(inputPermission: any) {
  const [havePermission, setHavePermission] = useState<boolean | null>(null);
  const roles = useSelector((state: RootState) => state.user.roles);
  useEffect(() => {
    async function checkPermissions() {
      const roleNames = roles.map((role) => role.name);
      setHavePermission(roleNames?.includes(inputPermission) ? true : false);
    }
    checkPermissions();
  });

  return havePermission;
}
