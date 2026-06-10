import { Fab } from "@mui/material";
import { useAdminGetLogsQuery } from "./api/admin-logs.api";
import { GetShamsiDateTime } from "../../../utilities/DateTime";
import { RefreshCircle } from "iconsax-reactjs";

export default function AdminLogs() {
	const logs = useAdminGetLogsQuery();

	let formatedLogs;

	if (logs.isSuccess && logs.data)
		formatedLogs = logs.data.data.split("%&").map(
			(log) =>
				log && {
					date: log
						.match(/\[[^{](.*?)[^}]\]/g)[0]
						.replace("[", "")
						.replace("]", ""),
					message: log
						.split(/\[[^{](.*?)[^}]\]/g)[2]
						.split(": ")[1]
						.trim(),
					type: log
						.split(/\[(.*?)\]/g)[2]
						.split(": ")[0]
						.split(".")[1],
				}
    );
  

	// NOTE "debug" | "info" | "notice" | "warning" | "error" | "critical" | "alert" | "emergency"
	const setLogColor = (type: string) => {
		switch (type?.toLowerCase()) {
			case "alert":
				return "#fff085";

			case "critical":
				return "#ffc9c9";

			case "debug":
				return "#e5e7eb";

			case "emergency":
				return "#ffc9c9";

			case "error":
				return "#ffc9c9";

			case "info":
				return "#bedbff";

			case "notice":
				return "#bedbff";

			case "warning":
				return "#fff085";

			default:
				return "#fff";
		}
  };
  
  const handleRefresh = () => {
    if (!logs.isUninitialized) logs.refetch();
  }

	return (
		<ul className="flex flex-col gap-4">
			<Fab
				color="primary"
				className="fixed bottom-8 right-8"
				onClick={handleRefresh}
			>
				<RefreshCircle
					size="32"
				/>
			</Fab>
			{formatedLogs &&
				formatedLogs.map(({ date, message, type }, index) => {
					if (message)
						return (
							<li
								key={index}
								className="flex gap-4 py-4 px-2 rounded-lg shadow-md"
								style={{ backgroundColor: setLogColor(type) }}
							>
								<p>{GetShamsiDateTime(date)}</p>
								<p className="text-wrap overflow-auto">{message}</p>
							</li>
						);
				})}
		</ul>
	);
}
