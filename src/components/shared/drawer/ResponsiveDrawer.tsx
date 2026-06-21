import { useLogoutMutation } from "../../../api/Auth/Logout";
import TechnicalVisitLogo from "../../../assets/icons/PNG-24 (1).png";
import TruckImage from "../../../assets/images/Truck.png";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { openChangePasswordDialog } from "../../../Stores/slices/change-passwrod-dialog.slice";
import {
  clear,
  restorePrevToken,
  setActiveMenuId,
} from "../../../Stores/slices/user";
import { GetShamsiDate } from "../../../utilities/DateTime";
import useHavePermission from "../Functions/CostumeHooks/CheckPermissions";
import SweetAlertToast from "../Functions/SweetAlertToast";
import PlateTextField from "../Inputs/PlateTextField";
import Header from "./Header";
import { Button, CircularProgress, Divider, Menu, MenuItem, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import {
  Buildings,
  Bus,
  DocumentCode,
  DocumentText,
  DocumentText1,
  HamburgerMenu,
  Home2,
  Key,
  Notification,
  ProfileCircle,
  ReceiptSearch,
  Setting2,
  Truck,
  TruckFast,
  User,
  UserOctagon,
  UserSquare,
  UserTag,
  Wallet1,
} from "iconsax-reactjs";
import { motion } from "motion/react";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { FaBus } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const MOBILE_BREAKPOINT = 768; // md breakpoint in pixels

// Helper function to check if a menu item is active based on path
const isMenuItemActive = (currentPath: string, itemPath: string): boolean => {
  // Remove query parameters for comparison
  const cleanCurrentPath = currentPath.split("?")[0];
  const cleanItemPath = itemPath.split("?")[0];

  // Exact match for dashboard root
  if (cleanItemPath === "/dashboard") {
    return (
      cleanCurrentPath === "/dashboard" || cleanCurrentPath === "/dashboard/"
    );
  }

  // For other routes, match exactly or on a path-segment boundary so that
  // e.g. "/dashboard/users" doesn't activate for "/dashboard/users-foo".
  return (
    cleanCurrentPath === cleanItemPath ||
    cleanCurrentPath.startsWith(`${cleanItemPath}/`)
  );
};

interface MenuItemProps {
  id: string;
  href: string;
  icon: React.ReactElement;
  title: string;
  isActive: boolean;
  onClick?: (id: string) => void;
}

const MenuItem2: FC<MenuItemProps> = ({
  id,
  href,
  icon,
  title,
  isActive,
  onClick,
}) => (
  <Link to={href} onClick={() => onClick?.(id)}>
    <List>
      <ListItem disablePadding>
        <div
          className={`bg-primary-light w-12 h-10 absolute rounded-l-lg ${isActive ? "block" : "hidden"}`}
        ></div>
        <ListItemButton className="flex items-center justify-between">
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={title}
            className={isActive ? "text-[#0AC27A]" : ""}
          />
        </ListItemButton>
      </ListItem>
    </List>
  </Link>
);

interface ResponsiveDrawerProps {
  children: ReactNode;
}

function ResponsiveDrawer({ children }: Readonly<ResponsiveDrawerProps>) {
  const dispatch = useAppDispatch();
  const prevToken = useAppSelector((state) => state.user.prevToken);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const settingsButtonRef = useRef(null);

  const [open, setOpen] = useState(false);

  const inspectionData = useAppSelector((state) => state.inspectionData);
  const selfStatementData = useAppSelector((state) => state.selfStatementData);

  const handleClose = () => {
    setOpen(false);
  };
  // Handle window resize and set initial mobile state
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isMobileView);

      // If switching to desktop view, ensure drawer is closed
      if (!isMobileView) {
        setMobileOpen(false);
      }
    };

    // Set initial state
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const form = useForm<Record<string, any>>({
    mode: "onTouched",
    defaultValues: {},
  });

  useEffect(() => {
    if (inspectionData)
      form.reset({
        ...inspectionData,
        first_number: String(
          inspectionData?.plate_first_number ??
            inspectionData?.plate_first_number,
        ),
        second_number: String(
          inspectionData?.plate_second_number ??
            inspectionData?.plate_second_number,
        ),
        third_character: String(
          inspectionData?.plate_character ?? inspectionData?.plate_character,
        ),
        fourth_number: String(
          inspectionData?.plate_fourth_number ??
            inspectionData?.plate_fourth_number,
        ),
      });
    else if (selfStatementData)
      form.reset({
        ...selfStatementData,
        first_number: String(
          selfStatementData?.truck.first_number ??
            selfStatementData?.truck.first_number,
        ),
        second_number: String(
          selfStatementData?.truck.second_number ??
            selfStatementData?.truck.second_number,
        ),
        third_character: String(
          selfStatementData?.truck.third_character ??
            selfStatementData?.truck.third_character,
        ),
        fourth_number: String(
          selfStatementData?.truck.fourth_number ??
            selfStatementData?.truck.fourth_number,
        ),
      });
  }, [inspectionData, selfStatementData]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleMenuClick = useCallback(
    (id: string) => {
      dispatch(setActiveMenuId(id));
      if (isMobile) {
        handleDrawerClose();
      }
    },
    [dispatch, isMobile],
  );

  const [logOutFn, logOutResult] = useLogoutMutation();

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
        SweetAlertToast.fire({
          title: "خروج با موفقیت انجام شد",
          icon: "success",
        });

        dispatch(clear());
      }
      navigate("/auth");
    }
  }, [logOutResult, dispatch, navigate]);

  const handleLogOut = () => {
    logOutFn();
  };

  const handleOpenChangePasswordDialog = () => {
    dispatch(openChangePasswordDialog());
    handleClose();
  };

  // Permission hooks
  const isDriver = useHavePermission("driver");
  const isCompanyAdmin = useHavePermission("company");
  const isCompanyUser = useHavePermission("userCompany");
  const isCompany = isCompanyAdmin || isCompanyUser;
  const isTechnicalManager = useHavePermission("technicalManager");
  const isAdmin = useHavePermission("admin");
  // Work type of the logged-in technical manager: 1 = freighter, 2 = passenger, 3 = both
  const tmWorkType = useAppSelector((state) => state.user.companyUsage);

  const menuItems2 = useMemo(
    () => [
      {
        id: "requests",
        href: "/dashboard/requests",
        image: <DocumentText1 size="24" color="#000" />,
        title: "درخواست بازدید",
        permission: isCompany,
      },
      {
        id: "technical-visit-freighter",
        href: "/dashboard/do-technical-visit-freighter",
        image: <TruckFast size="24" color="#000" />,
        title: "بازدید باری",
        permission: isTechnicalManager && tmWorkType !== 2,
      },
      {
        id: "technical-visit-passenger",
        href: "/dashboard/do-technical-visit-passenger",
        image: <Bus size="24" color="#000" />,
        title: "بازدید مسافری",
        permission: isTechnicalManager && tmWorkType !== 1,
      },
      {
        id: "self-statement",
        href: "/dashboard/self-statement",
        image: <DocumentText size="24" color="#000" />,
        title: "خوداظهاری",
        permission: isDriver,
      },
      {
        id: "my-fleet",
        href: "/dashboard/driverFleet",
        image: <Truck size="24" color="#000" />,
        title: "ناوگان من",
        permission: isDriver,
      },
      {
        id: "technical-managers",
        href: "/dashboard/technicalmanagers",
        image: <UserOctagon size="24" color="#000" />,
        title: "مدیران فنی",
        permission: isCompany,
      },
      {
        id: "company-fleet",
        href: "/dashboard/companyFleet",
        image: <Truck size="24" color="#000" />,
        title: "ناوگان شرکت",
        permission: isCompany,
      },
      {
        id: "drivers",
        href: "/dashboard/drivers",
        image: <UserSquare size="24" color="#000" />,
        title: "رانندگان",
        permission: isCompany,
      },
      {
        id: "users",
        href: "/dashboard/users",
        // image: UsersIcon,
        image: <User size="24" color="#000" />,
        title: "کاربران",
        permission: isCompany,
      },
      // {
      // 	id: "profile",
      // 	href: "/dashboard/profile",
      // 	image: (
      // 		<ProfileCircle
      // 			size="24"
      // 			color="#000"
      // 		/>
      // 	),
      // 	title: "پروفایل",
      // 	permission: true,
      // },
      {
        id: "wallet",
        href: "/dashboard/wallet",
        image: <Wallet1 size="24" color="#000" />,
        title: "کیف پول",
        permission: isDriver || isCompany,
      },
      // {
      // 	id: "reports",
      // 	href: "/dashboard/reports",
      // 	image: (
      // 		<DocumentText
      // 			size="24"
      // 			color="#000"
      // 		/>
      // 	),
      // 	title: "گزارشات",
      // 	permission: isCompany,
      // },
      {
        id: "register",
        href: "/dashboard/register",
        image: <UserTag size="24" color="#000" />,
        title: "احراز هویت",
        permission: !(isDriver || isCompany || isTechnicalManager),
      },
      {
        id: "admin-companies",
        href: "/dashboard/admin/companies",
        image: <Buildings size="24" color="#000" />,
        title: "شرکت ها",
        permission: isAdmin,
      },
      {
        id: "admin-technical-managers",
        href: "/dashboard/admin/technicalmanagers",
        image: <UserOctagon size="24" color="#000" />,
        title: "مدیران فنی",
        permission: isAdmin,
      },
      {
        id: "admin-drivers",
        href: "/dashboard/admin/drivers",
        image: <UserSquare size="24" color="#000" />,
        title: "رانندگان",
        permission: isAdmin,
      },
      {
        id: "admin-fleet",
        href: "/dashboard/admin/fleet",
        image: <Truck size="24" color="#000" />,
        title: "ناوگان",
        permission: isAdmin,
      },
      {
        id: "admin-company-users",
        href: "/dashboard/admin/company-users",
        image: <User size="24" color="#000" />,
        title: "کاربران شرکت ها",
        permission: isAdmin,
      },
      {
        id: "admin-users",
        href: "/dashboard/admin/users",
        image: <User size="24" color="#000" />,
        title: "کل کاربران",
        permission: isAdmin,
      },
      {
        id: "admin-inspections",
        href: "/dashboard/admin/inspections",
        image: <ReceiptSearch size="24" color="#000" />,
        title: "بازدید های فنی",
        permission: isAdmin,
      },
      {
        id: "admin-settings",
        href: "/dashboard/admin/settings",
        image: <Setting2 size="24" color="#000" />,
        title: "تنظیمات سیستم",
        permission: isAdmin,
      },
      {
        id: "admin-logs",
        href: "/dashboard/admin/logs",
        image: <DocumentCode size="24" color="#000" />,
        title: "لوگ های سیستم",
        permission: isAdmin,
      },
    ],
    [isCompany, isTechnicalManager, isDriver, isAdmin, tmWorkType],
  );

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

  const menuComponent = useMemo(
    () =>
      menuItems2.map(
        (item, index) =>
          item.permission && (
            <motion.div
              key={item.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <MenuItem2
                id={item.id}
                href={item.href}
                icon={item.image}
                title={item.title}
                isActive={isMenuItemActive(location.pathname, item.href)}
                onClick={handleMenuClick}
              />
            </motion.div>
          ),
      ),
    [menuItems2, location.pathname, handleMenuClick],
  );

  const company = useAppSelector(state => state.user.company);
  const user = useAppSelector(state => state.user.personal)

  const drawer = (
    <div className="sticky overflow-x-hidden drawer-container">
      <Toolbar className="flex items-center justify-center">
        <img className="max-h-32" alt="logo" src={TechnicalVisitLogo} />
      </Toolbar>
      <Divider className="w-full! bg-primary!" />
      <Typography className="text-center bg-primary/25 p-1 font-black! text-xl">
        {company?.name ?? user?.full_name}
      </Typography>
      <Divider className="w-full! bg-primary!" />
      <MenuItem2
        id="dashboard"
        href="/dashboard"
        // icon={HomeIcon}
        icon={<Home2 size="24" color="#000" />}
        title="داشبورد"
        isActive={isMenuItemActive(location.pathname, "/dashboard")}
        onClick={handleMenuClick}
      />
      {menuComponent}
      {isMobile && (
        <List className="mt-6">
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogOut}
              disabled={logOutResult.isLoading}
            >
              {logOutResult.isLoading ? (
                <ListItemIcon>
                  <CircularProgress color="inherit" size={20} />
                </ListItemIcon>
              ) : (
                <>
                  <ListItemIcon>
                    <IoIosArrowRoundBack className="rotate-180" size={35} />
                  </ListItemIcon>
                  <ListItemText primary="خروج از سامانه" />
                </>
              )}
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </div>
  );

  // ! نمایش اطلاعات کاربر
  return (
    <div>
      <Box sx={{ display: "flex", width: "100%" }}>
        <AppBar
          position="fixed"
          sx={{
            ml: { lg: `${drawerWidth}px` },
            backgroundColor: "white",
          }}
          id="main-header"
          className="hidden md:flex w-[calc(100%-240px)]"
        >
          <Header />
        </AppBar>
        <div
          className={`fixed top-0 left-0 right-0 flex flex-col items-center justify-evenly ${
            location.pathname === "/dashboard/wallet" ||
            location.pathname.startsWith(
              "/dashboard/do-technical-visit/checklist/",
            ) ||
            location.pathname.startsWith("/dashboard/self-statement/checklist/")
              ? "bg-primary"
              : "bg-[#c4d5dc]"
          } h-fit  shadow-lg z-60 md:hidden`}
        >
          <div className="flex justify-between items-center min-w-[300px] max-w-[650px] w-[90%]">
            {/* Left: hamburger */}
            <IconButton onClick={handleDrawerToggle}>
              <HamburgerMenu size="24" color="#000" />
            </IconButton>

            {/* Center: technical visit buttons */}
            <div className="flex items-center gap-1">
              {isTechnicalManager && tmWorkType !== 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<TruckFast size="16" />}
                  onClick={() => navigate("/dashboard/do-technical-visit-freighter")}
                  sx={{ fontSize: "0.7rem", py: 0.5, px: 1, whiteSpace: "nowrap" }}
                >
                  بازدید فنی باری
                </Button>
              )}
              {isTechnicalManager && tmWorkType !== 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Bus size="16" />}
                  onClick={() => navigate("/dashboard/do-technical-visit-passenger")}
                  sx={{ fontSize: "0.7rem", py: 0.5, px: 1, whiteSpace: "nowrap" }}
                >
                  بازدید فنی مسافری
                </Button>
              )}
            </div>

            {/* Right: settings, notification */}
            <div className="flex items-center gap-2">
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
                onMouseEnter={(event) => {
                  (event.target as HTMLButtonElement).classList.add(
                    "animation-bell",
                  );
                }}
                onMouseLeave={(event) => {
                  (event.target as HTMLButtonElement).classList.remove(
                    "animation-bell",
                  );
                }}
              >
                <Notification size="24" color="#000" />
              </IconButton>
            </div>
          </div>
          {/* {location.pathname === "/dashboard/wallet" && (
						<Box className="flex flex-col items-center justify-center gap-2 p-4">
							<Box className="w-[80vw] h-[18vh] relative rounded-3xl">
								<Box className="backdrop-blur-[10px] border-4 border-[#75f4c5] z-10 w-full h-full rounded-3xl"></Box>
								<Box className="bg-white absolute top-0 right-0 border-4 border-[#75f4c5] -z-20 w-full h-full rounded-3xl"></Box>
								<Box className="w-20 h-20 bg-primary-dark rounded-full absolute -top-4 -right-4 -z-10"></Box>
								<Box className="w-12 h-12 bg-primary-dark rounded-full absolute bottom-5 -left-4 -z-10"></Box>
								<Box className="flex flex-col w-full h-full absolute top-0 right-0 z-30 gap-4 items-start p-6">
									<Box className="flex flex-row items-center">
										<Typography className="font-semibold tracking-tight">موجودی کیف پول</Typography>
										<Box className="rounded-3xl w-16 h-5 bg-[linear-gradient(50deg,#00eb93_30%,transparent_70%)]"></Box>
									</Box>
									<Box className="flex flex-row items-center gap-2 self-center">
										<Typography className="text-3xl font-bold">{makePriceHumanReadable(ToPersianNumber("36459205"))}</Typography>
										<Typography className="font-semibold">تومان</Typography>
									</Box>
									<Box className="flex flex-row gap-2 items-center self-end">
										<Typography className="font-['Yekan Bakh FaNum'] font-bold text-[0.75rem]">درخواست تسویه حساب</Typography>
										<FaArrowLeftLong />
									</Box>
								</Box>
								<svg
									width="100"
									height="100"
									viewBox="0 0 100 100"
									xmlns="http://www.w3.org/2000/svg"
									className="absolute right-1 bottom-1 rotate-30"
								>
									<path
										d="M -11 103 Q 15 97 15 81 Q 21 41 108 45"
										fill="none"
										stroke="#e0e0e0"
										stroke-width="1"
									/>
									<path
										d="M 11 102 Q 26 91 27 85 Q 32 54 105 57"
										fill="none"
										stroke="#e0e0e0"
										stroke-width="1"
									/>
									<path
										d="M 30 100 Q 44 60 106 70"
										fill="none"
										stroke="#e0e0e0"
										stroke-width="1"
									/>
								</svg>
							</Box>
						</Box>
					)} */}
          {(location.pathname.startsWith(
            "/dashboard/do-technical-visit/checklist/",
          ) ||
            location.pathname.startsWith(
              "/dashboard/self-statement/checklist/",
            )) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Box
                sx={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='25' ry='25' stroke='%23333' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='43' stroke-linecap='square'/%3e%3c/svg%3e");`,
                }}
                className="flex flex-col p-4 items-center justify-center m-4 bg-white rounded-[25px]"
              >
                <Box className="flex flex-row justify-between items-center">
                  <Box className="flex flex-col gap-2 w-[70vw] p-2">
                    <Box className="flex flex-row justify-between items-center">
                      <Box className="flex flex-col items-start gap-2">
                        <Typography className="font-['Yekan Bakh FaNum'] font-bold text-lg">
                          {inspectionData && !selfStatementData
                            ? inspectionData?.type === 1
                              ? "باری"
                              : "مسافری"
                            : ""}
                          {selfStatementData ? "باری" : ""}
                        </Typography>
                        <Typography className="font-['Yekan Bakh FaNum'] font-bold text-sm">
                          {GetShamsiDate(new Date())}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {inspectionData || selfStatementData ? (
                    <PlateTextField
                      readOnly
                      control={form.control}
                      watch={form.watch}
                    />
                  ) : (
                    "پلاک موجود نیست"
                  )}
                </Box>
                <Box
                  sx={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='25' ry='25' stroke='%23DCE3ECFF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='10' stroke-linecap='square'/%3e%3c/svg%3e");`,
                  }}
                  className="flex flex-row justify-between items-center w-full py-2 px-4 rounded-full"
                >
                  <Typography>
                    {inspectionData?.truck_info?.loader_name ??
                      selfStatementData?.truck?.loader_type ??
                      ""}
                  </Typography>
                  {inspectionData?.type === 1 ? (
                    <img src={TruckImage} alt="truck" />
                  ) : (
                    <FaBus />
                  )}
                </Box>
              </Box>
            </motion.div>
          )}
        </div>
        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "block", md: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${drawerWidth}px)`, sm: "100%" },
          }}
          className="p-0 md:p-5 lg:p-6 xl:p-7 max-lg:w-screen"
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </div>
  );
}

export default ResponsiveDrawer;
