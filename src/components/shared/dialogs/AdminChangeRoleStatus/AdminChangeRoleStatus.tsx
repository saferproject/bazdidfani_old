import { useAppSelector } from "../../../../Stores/hooks";
import SweetAlertToast from "../../Functions/SweetAlertToast";
import {
  AdminRoleState,
  useAssignUserRoleMutation,
  useGetRoleStatesQuery,
  useRemoveUserRoleMutation,
} from "./api/change-role-status.api";
import AdminChangeRoleStatusProps from "./interfaces/admin-change-role-status-props.interface";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const dedicatedRolePaths: Record<string, string> = {
  company: "/dashboard/admin/companies?create=true",
  driver: "/dashboard/admin/drivers?create=true",
  technical_manager: "/dashboard/admin/technicalmanagers?create=true",
  technicalManager: "/dashboard/admin/technicalmanagers?create=true",
  user_company: "/dashboard/admin/company-users",
  userCompany: "/dashboard/admin/company-users",
};

const isActiveStatus = (status: AdminRoleState["status"]) =>
  status === 1 || status === "1" || status === "active";

const AdminChangeRoleStatus: FC<AdminChangeRoleStatusProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.user.personal?.user_id);
  const roleStates = useGetRoleStatesQuery(user.id);
  const [assignRole, assignResult] = useAssignUserRoleMutation();
  const [removeRole, removeResult] = useRemoveUserRoleMutation();
  const isChanging = assignResult.isLoading || removeResult.isLoading;

  const handleChangeRole = async (role: AdminRoleState) => {
    try {
      const result = role.assigned
        ? await removeRole({ userId: user.id, roleId: role.role_id }).unwrap()
        : await assignRole({
            userId: user.id,
            roleId: role.role_id,
            status: 1,
          }).unwrap();

      SweetAlertToast.fire({ icon: "success", text: result.message });
    } catch {
      // API errors are presented by the shared base query.
    }
  };

  const openDedicatedForm = (role: string) => {
    const path = dedicatedRolePaths[role];
    if (!path) return;
    onClose();
    navigate(path);
  };

  const roles = roleStates.data
    ? Object.values(roleStates.data.data.roles)
    : [];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-2 lg:p-4">
        <div className="w-full flex items-center justify-between">
          <DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">
            مدیریت نقش‌های کاربر
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseCircle size="24" className="text-red-500" />
          </IconButton>
        </div>
        <DialogContent className="flex flex-col gap-4 mb-2">
          <FormGroup className="gap-3">
            {roles.map((role) => {
              const isOwnAdminRole =
                role.role_id === 4 &&
                role.assigned &&
                Number(currentUserId) === user.id;
              const dedicatedPath = dedicatedRolePaths[role.role];

              return (
                <div
                  key={role.role_id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span>{role.title}</span>
                    <Chip
                      size="small"
                      color={
                        role.assigned && isActiveStatus(role.status)
                          ? "success"
                          : "default"
                      }
                      label={
                        role.assigned
                          ? isActiveStatus(role.status)
                            ? "فعال"
                            : "غیرفعال"
                          : "تخصیص داده نشده"
                      }
                    />
                  </div>
                  {role.assignable ? (
                    <FormControlLabel
                      className="m-0"
                      label={role.assigned ? "حذف نقش" : "تخصیص نقش"}
                      control={
                        <Switch
                          checked={role.assigned}
                          disabled={isChanging || isOwnAdminRole}
                          onChange={() => handleChangeRole(role)}
                          inputProps={{
                            "aria-label": `${role.assigned ? "حذف" : "تخصیص"} نقش ${role.title}`,
                            title: isOwnAdminRole
                              ? "امکان حذف نقش مدیر سامانه از حساب خودتان وجود ندارد"
                              : undefined,
                          }}
                        />
                      }
                    />
                  ) : dedicatedPath ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openDedicatedForm(role.role)}
                    >
                      فرم اختصاصی نقش
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-500">
                      فقط از فرم اختصاصی این نقش قابل مدیریت است
                    </span>
                  )}
                </div>
              );
            })}
          </FormGroup>
          {roleStates.isLoading && (
            <p className="text-sm text-gray-500">در حال دریافت نقش‌ها...</p>
          )}
        </DialogContent>
        <div className="flex items-center gap-2">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            بازگشت
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AdminChangeRoleStatus;
