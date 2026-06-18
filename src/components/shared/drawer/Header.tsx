import { useLogoutMutation } from "../../../api/Auth/Logout";
import HeaderAvatar from "../../../assets/images/HeaderAvatar.png";
import CompanyUsage from "../../../pages/dashboard/admin/enums/company-usage.enum";
import { useAppDispatch } from "../../../Stores/hooks";
import { openChangePasswordDialog } from "../../../Stores/slices/change-passwrod-dialog.slice";
import { clear, restorePrevToken } from "../../../Stores/slices/user";
import { RootState } from "../../../Stores/store";
import useHavePermission from "../Functions/CostumeHooks/CheckPermissions";
import SweetAlertToast from "../Functions/SweetAlertToast";
import {
  Avatar,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Bus,
  Key,
  Logout,
  Notification,
  ProfileCircle,
  Setting2,
  TruckFast,
  UserTag,
} from "iconsax-reactjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const personal = useSelector((state: RootState) => state.user.personal);
  const roles = useSelector((state: RootState) => state.user.roles);
  const profileImage = useSelector(
    (state: RootState) => state.user.profileImage,
  );
  const prevToken = useSelector((state: RootState) => state.user.prevToken);
  const companyUsage = useSelector((state: RootState) => state.user.companyUsage);
  const isTechnicalManager = useHavePermission("technicalManager");

  const settingsButtonRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [logOutFn, logOutResult] = useLogoutMutation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenChangePasswordDialog = () => {
    dispatch(openChangePasswordDialog());
    handleClose();
  };

  const rolesText = useMemo(() => {
    if (roles.length === 0) return "کاربر احراز هویت نشده است";
    else if (roles.length > 0)
      return `${roles.map((ele: any) => ele.description).join(" , ")}`;
    else return roles?.map((role: any) => ` ${role.description} ،`);
  }, [roles]);

  const menuItems = useMemo(() => {
    return [
      {
        href: "/dashboard/profile",
        icon: <ProfileCircle size="24" color="#000" />,
        title: "پروفایل",
      },
      {
        href: "/dashboard/register",
        icon: <UserTag size="24" color="#000" />,
        title: "احراز هویت",
      },
      {
        action: handleOpenChangePasswordDialog,
        icon: <Key size="24" color="#000" />,
        title: "تغییر رمز عبور",
      },
    ];
  }, []);

  useEffect(() => {
    if (logOutResult.isSuccess || logOutResult.isError) {
      // اگر در حالت ورود به‌جای کاربر هستیم، به‌جای خروج کامل به حساب مدیر بازمی‌گردیم
      if (prevToken) {
        dispatch(restorePrevToken());
        if (logOutResult.isSuccess)
          SweetAlertToast.fire({
            title: "بازگشت به حساب مدیریت انجام شد",
            icon: "success",
          });
        window.location.href = "/dashboard";
        return;
      } else if (logOutResult.isSuccess) {
        dispatch(clear());
        SweetAlertToast.fire({
          title: "خروج با موفقیت انجام شد",
          icon: "success",
        });
      }
      navigate("/auth");
    }
  }, [logOutResult, dispatch, navigate]);

  return (
    <div className="w-full h-full flex items-center justify-between p-2">
      {/* Left: avatar + name */}
      <div className="flex items-center">
        <Avatar alt="Profile Image" src={profileImage || HeaderAvatar} />
        <div className="hidden lg:block mx-3 text-gray-700">
          <h1 className="font-bold text-[1vw]">{personal?.full_name}</h1>
          <p className="font-semibold text-[0.7vw]">{rolesText}</p>
        </div>
      </div>

      {/* Center: technical visit buttons */}
      <div className="flex items-center gap-2">
        {isTechnicalManager && companyUsage !== CompanyUsage.PASSENGER && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<TruckFast size="18" />}
            onClick={() => navigate("/dashboard/do-technical-visit-freighter")}
            className="whitespace-nowrap"
          >
            بازدید فنی باری
          </Button>
        )}
        {isTechnicalManager && companyUsage !== CompanyUsage.FREIGHTER && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Bus size="18" />}
            onClick={() => navigate("/dashboard/do-technical-visit-passenger")}
            className="whitespace-nowrap"
          >
            بازدید فنی مسافری
          </Button>
        )}
      </div>

      {/* Right: notification, settings, logout */}
      <div className="flex items-center gap-x-2">
        <IconButton
          title="اعلان ها"
          onMouseEnter={(event) => {
            (event.target as HTMLButtonElement).classList.add("animation-bell");
          }}
          onMouseLeave={(event) => {
            (event.target as HTMLButtonElement).classList.remove(
              "animation-bell",
            );
          }}
        >
          <Notification size="24" color="#000" />
        </IconButton>
        <IconButton
          title="تنظیمات"
          className="hover:rotate-180 transition-transform"
          ref={settingsButtonRef}
          onClick={() => setOpen(true)}
        >
          <Setting2 size="24" color="#000" />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={settingsButtonRef.current}
          open={open}
          onClose={handleClose}
        >
          {menuItems.map(({ title, icon, action, href }) =>
            action ? (
              <MenuItem onClick={action}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={handleClose}>
                <Link to={href} className="flex">
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{title}</ListItemText>
                </Link>
              </MenuItem>
            ),
          )}
        </Menu>
        <IconButton
          title="خروج"
          onClick={() => logOutFn()}
          className="rotate-180 text-black hover:text-red-500! transition-all"
          onMouseEnter={(event) => {
            (event.target as HTMLButtonElement).classList.add("animation-exit");
          }}
          onMouseLeave={(event) => {
            (event.target as HTMLButtonElement).classList.remove(
              "animation-exit",
            );
          }}
        >
          <Logout size="24" />
        </IconButton>
      </div>
    </div>
  );
}
