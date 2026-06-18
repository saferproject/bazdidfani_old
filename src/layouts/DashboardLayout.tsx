import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import ResponsiveDrawer from "../components/shared/drawer/ResponsiveDrawer";
import { useVerifyTokenQuery } from "../api/Auth/Login";
import { LinearProgress } from "@mui/material";
import RemoveAuthStep from "../components/shared/BackgroundLogics/RemoveAuthStep/RemoveAuthStep";
import { useAppSelector } from "../Stores/hooks";
import SaferTextDialog from "../components/shared/dialogs/TextDialog/TextDialog";
import ChangePasswordDialog from "../components/shared/dialogs/ChangePasswordDialog/ChangePasswordDialog";
import ErrorBoundary from "../components/shared/ErrorBoundary/ErrorBoundary";
import useNotification from "./notification";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCompany } from "../Stores/slices/user";

const DashboardLayout = () => {
	const saferTextDialogData = useAppSelector((state) => state.textDialog);
	const changePasswordDialog = useAppSelector((state) => state.changePasswordDialog);

	const dispatch = useDispatch();

	const location = useLocation();
	const [searchParams] = useSearchParams();
	const userData = useVerifyTokenQuery(null, {
		skip: searchParams.get("register") !== null,
	});

	useEffect(() => {
		if (userData.isSuccess) dispatch(setCompany(userData.data?.company));
	}, [userData]);

	useNotification();

	return (
		<>
			{saferTextDialogData?.isOpen && <SaferTextDialog {...saferTextDialogData} />}
			{changePasswordDialog?.isOpen && <ChangePasswordDialog />}
			{(userData.isSuccess || userData.isUninitialized) && (
				<ResponsiveDrawer>
					<RemoveAuthStep />
					<div className="bg-white shadow-lg rounded-[25px] py-8 flex flex-col items-center justify-center px-6">
						<div className="w-full">
							<ErrorBoundary resetKey={location.pathname}>
								<Outlet />
							</ErrorBoundary>
						</div>
					</div>
				</ResponsiveDrawer>
			)}
			{(userData.isLoading || userData.isFetching) && <LinearProgress />}
		</>
	);
};

export default DashboardLayout;
