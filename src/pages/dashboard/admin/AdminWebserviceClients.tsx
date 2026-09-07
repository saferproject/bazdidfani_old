import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import CustomDialog from "../../../components/shared/Dialog/CustomeDialog";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import SaferPagination from "../../../components/shared/Pagination/SaferPagination";
import { GetShamsiDateTime } from "../../../utilities/DateTime";
import {
  useCreateWebserviceClientMutation,
  useDeleteWebserviceClientMutation,
  useGetWebserviceClientsQuery,
  useRotateWebserviceClientMutation,
  useUpdateWebserviceClientMutation,
} from "./api/admin-webservice-clients.api";
import WebserviceClient from "./interfaces/webservice-client.interface";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Copy,
  Edit,
  Key,
  Refresh,
  SearchNormal1,
  Trash,
} from "iconsax-reactjs";
import { FormEvent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type ClientDialogState =
  | { mode: "create"; client: null }
  | { mode: "edit"; client: WebserviceClient }
  | null;

const toApiDateTime = (value: string | null) =>
  value ? new Date(value.replace(" ", "T")).toISOString() : undefined;

const displayDate = (value: string | null, fallback = "ثبت نشده") =>
  value ? GetShamsiDateTime(value) : fallback;

const ClientFormDialog = ({
  state,
  loading,
  onClose,
  onSubmit,
}: {
  state: Exclude<ClientDialogState, null>;
  loading: boolean;
  onClose: () => void;
  // The name documents the callback payload for component consumers.
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: {
    name: string;
    expires_at?: string | null;
    is_active?: boolean;
  }) => Promise<void>;
}) => {
  const isEdit = state.mode === "edit";
  const [name, setName] = useState(state.client?.name ?? "");
  const [isActive, setIsActive] = useState(state.client?.is_active ?? true);
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit: handleDateFormSubmit,
    formState: { errors },
  } = useForm<{ expires_at: string | null }>({
    defaultValues: { expires_at: state.client?.expires_at ?? null },
  });

  const handleSubmit = async ({
    expires_at: expiresAt,
  }: {
    expires_at: string | null;
  }) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("نام دسترسی الزامی است.");
      return;
    }

    setError("");
    await onSubmit({
      name: normalizedName,
      ...(isEdit
        ? {
            expires_at: toApiDateTime(expiresAt) ?? null,
            is_active: isActive,
          }
        : expiresAt
          ? { expires_at: toApiDateTime(expiresAt) }
          : {}),
    });
  };

  return (
    <CustomDialog
      show
      fullWidth
      maxWidth="sm"
      showTitle
      title={isEdit ? "ویرایش دسترسی وب‌سرویس" : "ساخت دسترسی وب‌سرویس"}
      hasOnClose={!loading}
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-5 pt-2"
        onSubmit={handleDateFormSubmit(handleSubmit)}
      >
        <TextField
          autoFocus
          fullWidth
          required
          label="نام دسترسی"
          placeholder="مثلاً سایت نمایندگی تهران"
          value={name}
          onChange={(event) => setName(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <DatePickerComponent
          name="expires_at"
          label="تاریخ انقضا (اختیاری)"
          control={control}
          disablePast
          error={Boolean(errors.expires_at)}
          rules={{
            validate: (value: string | null) =>
              !value ||
              new Date(value.replace(" ", "T")).getTime() > Date.now() ||
              "تاریخ انقضا باید در آینده باشد.",
          }}
        />
        <p className="-mt-3 text-xs text-gray-500">
          اگر خالی باشد، دسترسی بدون تاریخ انقضا خواهد بود.
        </p>
        {isEdit && (
          <label className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2">
            <span className="font-medium">دسترسی فعال باشد</span>
            <Switch
              className="rotate-180"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
          </label>
        )}
        {error && <Alert severity="warning">{error}</Alert>}
        <div className="flex justify-end gap-3">
          <Button
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={onClose}
          >
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ساخت توکن"
            )}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

const AdminWebserviceClients = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "1" | "0">("all");
  const [clientDialog, setClientDialog] = useState<ClientDialogState>(null);
  const [rotateTarget, setRotateTarget] = useState<WebserviceClient | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<WebserviceClient | null>(
    null,
  );
  const [revealedToken, setRevealedToken] = useState<{
    name: string;
    token: string;
  } | null>(null);
  const [statusTargetId, setStatusTargetId] = useState<number | null>(null);

  const params = useMemo(
    () => ({
      page,
      per_page: perPage,
      ...(query ? { query } : {}),
      ...(activeFilter === "all"
        ? {}
        : { is_active: Number(activeFilter) as 0 | 1 }),
    }),
    [activeFilter, page, perPage, query],
  );
  const clients = useGetWebserviceClientsQuery(params);
  const [createClient, createResult] = useCreateWebserviceClientMutation();
  const [updateClient, updateResult] = useUpdateWebserviceClientMutation();
  const [rotateClient, rotateResult] = useRotateWebserviceClientMutation();
  const [deleteClient, deleteResult] = useDeleteWebserviceClientMutation();

  const rows = clients.data?.data.data ?? [];
  const totalPages = Math.max(
    1,
    Math.ceil(
      (clients.data?.data.total ?? 0) /
        (clients.data?.data.per_page || perPage),
    ),
  );

  const notifySuccess = (message: string) =>
    SweetAlertToast.fire({ icon: "success", text: message });

  const handleFormSubmit = async (values: {
    name: string;
    expires_at?: string | null;
    is_active?: boolean;
  }) => {
    try {
      if (clientDialog?.mode === "edit") {
        const response = await updateClient({
          id: clientDialog.client.id,
          ...values,
        }).unwrap();
        notifySuccess(response.message);
      } else {
        const response = await createClient({
          name: values.name,
          ...(values.expires_at ? { expires_at: values.expires_at } : {}),
        }).unwrap();
        setRevealedToken({
          name: response.data.client.name,
          token: response.data.token,
        });
        notifySuccess(response.message);
      }
      setClientDialog(null);
    } catch {
      // AxiosBaseQuery displays the API error and field validation details.
    }
  };

  const handleStatusChange = async (
    client: WebserviceClient,
    checked: boolean,
  ) => {
    setStatusTargetId(client.id);
    try {
      const response = await updateClient({
        id: client.id,
        is_active: checked,
      }).unwrap();
      notifySuccess(response.message);
    } catch {
      // Error feedback is centralized in AxiosBaseQuery.
    } finally {
      setStatusTargetId(null);
    }
  };

  const handleRotate = async () => {
    if (!rotateTarget) return;
    try {
      const response = await rotateClient(rotateTarget.id).unwrap();
      setRevealedToken({
        name: response.data.client.name,
        token: response.data.token,
      });
      setRotateTarget(null);
      notifySuccess(response.message);
    } catch {
      // Error feedback is centralized in AxiosBaseQuery.
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await deleteClient(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      notifySuccess(response.message);
    } catch {
      // Error feedback is centralized in AxiosBaseQuery.
    }
  };

  const copyToken = async () => {
    if (!revealedToken) return;
    try {
      await navigator.clipboard.writeText(revealedToken.token);
      SweetAlertToast.fire({ icon: "success", text: "توکن کپی شد." });
    } catch {
      SweetAlertToast.fire({
        icon: "error",
        text: "کپی خودکار انجام نشد؛ توکن را به‌صورت دستی کپی کنید.",
      });
    }
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setQuery(searchText.trim());
  };

  const renderActions = (client: WebserviceClient) => (
    <div className="flex items-center justify-center">
      <Tooltip title="ویرایش">
        <IconButton onClick={() => setClientDialog({ mode: "edit", client })}>
          <Edit size="22" className="text-amber-500" />
        </IconButton>
      </Tooltip>
      <Tooltip title="چرخش توکن">
        <IconButton onClick={() => setRotateTarget(client)}>
          <Refresh size="22" className="text-blue-500" />
        </IconButton>
      </Tooltip>
      <Tooltip title="حذف و ابطال">
        <IconButton onClick={() => setDeleteTarget(client)}>
          <Trash size="22" className="text-red-500" />
        </IconButton>
      </Tooltip>
    </div>
  );

  return (
    <section className="flex flex-col gap-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Key size="30" className="text-primary" />
          <div>
            <h2 className="text-xl font-bold">دسترسی‌های وب‌سرویس</h2>
            <p className="mt-1 text-sm text-gray-500">
              مدیریت توکن سایت‌ها و سرویس‌های مصرف‌کننده
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Add size="22" />}
          onClick={() => setClientDialog({ mode: "create", client: null })}
        >
          ساخت دسترسی
        </Button>
      </header>

      <form
        className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row"
        onSubmit={submitSearch}
      >
        <TextField
          size="small"
          fullWidth
          label="جستجو در نام یا پیشوند توکن"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <FormControl size="small" className="sm:min-w-40">
          <InputLabel>وضعیت</InputLabel>
          <Select
            label="وضعیت"
            value={activeFilter}
            onChange={(event) => {
              setActiveFilter(event.target.value as "all" | "1" | "0");
              setPage(1);
            }}
          >
            <MenuItem value="all">همه</MenuItem>
            <MenuItem value="1">فعال</MenuItem>
            <MenuItem value="0">غیرفعال</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="outlined"
          startIcon={<SearchNormal1 size="20" />}
          className="sm:min-w-28"
        >
          جستجو
        </Button>
      </form>

      {clients.isLoading || clients.isFetching ? (
        <div className="flex min-h-48 items-center justify-center">
          <CircularProgress />
        </div>
      ) : rows.length === 0 ? (
        <Alert severity="info">دسترسی وب‌سرویسی با این مشخصات پیدا نشد.</Alert>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 sm:block">
            <table className="w-full min-w-215 text-sm">
              <thead className="bg-gray-100 font-bold">
                <tr>
                  <th className="p-3 text-right">نام</th>
                  <th className="p-3">پیشوند توکن</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3">قابل استفاده</th>
                  <th className="p-3">انقضا</th>
                  <th className="p-3">آخرین استفاده</th>
                  <th className="p-3">سازنده</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold">{client.name}</td>
                    <td className="p-3 text-center">
                      <code dir="ltr">{client.token_prefix}</code>
                    </td>
                    <td className="p-3 text-center">
                      {statusTargetId === client.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Switch
                          className="rotate-180"
                          checked={client.is_active}
                          onChange={(event) =>
                            handleStatusChange(client, event.target.checked)
                          }
                        />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Chip
                        size="small"
                        color={client.is_usable ? "success" : "default"}
                        label={client.is_usable ? "بله" : "خیر"}
                      />
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {displayDate(client.expires_at, "بدون انقضا")}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {displayDate(client.last_used_at)}
                    </td>
                    <td className="p-3 text-center">
                      {client.created_by?.username ?? "—"}
                    </td>
                    <td className="p-3">{renderActions(client)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 sm:hidden">
            {rows.map((client) => (
              <article
                key={client.id}
                className="rounded-2xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{client.name}</h3>
                    <code
                      dir="ltr"
                      className="mt-1 block text-sm text-gray-500"
                    >
                      {client.token_prefix}
                    </code>
                  </div>
                  <Chip
                    size="small"
                    color={client.is_usable ? "success" : "default"}
                    label={
                      client.is_usable ? "قابل استفاده" : "غیرقابل استفاده"
                    }
                  />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">انقضا</dt>
                    <dd>{displayDate(client.expires_at, "بدون انقضا")}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">آخرین استفاده</dt>
                    <dd>{displayDate(client.last_used_at)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                  <label className="flex items-center gap-1 text-sm">
                    فعال
                    {statusTargetId === client.id ? (
                      <CircularProgress size={22} />
                    ) : (
                      <Switch
                        size="small"
                        className="rotate-180"
                        checked={client.is_active}
                        onChange={(event) =>
                          handleStatusChange(client, event.target.checked)
                        }
                      />
                    )}
                  </label>
                  {renderActions(client)}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <SaferPagination
        totalPages={totalPages}
        currentPage={page}
        itemsPerPage={perPage}
        onPageChange={setPage}
        onItemsPerPageChange={(value) => {
          setPerPage(value);
          setPage(1);
        }}
      />

      {clientDialog && (
        <ClientFormDialog
          key={`${clientDialog.mode}-${clientDialog.client?.id ?? "new"}`}
          state={clientDialog}
          loading={createResult.isLoading || updateResult.isLoading}
          onClose={() => setClientDialog(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      <CustomDialog
        show={Boolean(rotateTarget)}
        fullWidth
        maxWidth="xs"
        showTitle
        title="چرخش توکن"
        hasOnClose={!rotateResult.isLoading}
        onClose={() => setRotateTarget(null)}
        dialogActions={
          <>
            <Button
              color="secondary"
              disabled={rotateResult.isLoading}
              onClick={() => setRotateTarget(null)}
            >
              انصراف
            </Button>
            <Button
              variant="contained"
              disabled={rotateResult.isLoading}
              onClick={handleRotate}
            >
              {rotateResult.isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "ساخت توکن جدید"
              )}
            </Button>
          </>
        }
      >
        <Alert severity="warning">
          توکن فعلی «{rotateTarget?.name}» بلافاصله نامعتبر می‌شود.
        </Alert>
      </CustomDialog>

      <CustomDialog
        show={Boolean(deleteTarget)}
        fullWidth
        maxWidth="xs"
        showTitle
        title="حذف دسترسی"
        hasOnClose={!deleteResult.isLoading}
        onClose={() => setDeleteTarget(null)}
        dialogActions={
          <>
            <Button
              color="secondary"
              disabled={deleteResult.isLoading}
              onClick={() => setDeleteTarget(null)}
            >
              انصراف
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={deleteResult.isLoading}
              onClick={handleDelete}
            >
              {deleteResult.isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "حذف و ابطال"
              )}
            </Button>
          </>
        }
      >
        <p>
          دسترسی «{deleteTarget?.name}» حذف و توکن آن برای همیشه باطل می‌شود.
        </p>
      </CustomDialog>

      <CustomDialog
        show={Boolean(revealedToken)}
        fullWidth
        maxWidth="sm"
        showTitle
        title="توکن وب‌سرویس"
        hasOnClose
        onClose={() => setRevealedToken(null)}
        dialogActions={
          <Button variant="contained" onClick={() => setRevealedToken(null)}>
            توکن را ذخیره کردم
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <Alert severity="warning">
            این توکن فقط همین یک‌بار نمایش داده می‌شود. پیش از بستن پنجره آن را
            در محل امن ذخیره کنید.
          </Alert>
          <p className="font-semibold">{revealedToken?.name}</p>
          <div
            className="flex items-center gap-2 rounded-xl bg-gray-100 p-3"
            dir="ltr"
          >
            <code className="min-w-0 flex-1 break-all text-left select-all">
              {revealedToken?.token}
            </code>
            <Tooltip title="کپی توکن">
              <IconButton color="primary" onClick={copyToken}>
                <Copy size="24" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </CustomDialog>
    </section>
  );
};

export default AdminWebserviceClients;
