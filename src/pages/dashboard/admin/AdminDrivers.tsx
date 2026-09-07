import AdminDriverForm from "./layouts/AdminDriverForm";
import AdminDriverList from "./layouts/AdminDriverList";
import AdminFormState from "./types/admin-form-states.type";
import AdminPageStates from "./types/admin-page-states.type";
import { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";

const AdminDrivers: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const openCreateForm = searchParams.get("create") === "true";
  const [pageState, setPageState] = useState<AdminPageStates>(
    openCreateForm ? "FORM" : "LIST",
  );
  const [formState, setFormState] = useState<AdminFormState | null>(
    openCreateForm ? "ADD" : null,
  );
  const [formData, setFormData] = useState(null);

  const clearCreateParam = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("create");
    setSearchParams(nextParams, { replace: true });
  };

  const changePageState = (state: AdminPageStates) => {
    setPageState(state);
  };

  const changeFormState = (state: AdminFormState | null) => {
    setFormState(state);
  };

  const handleAddDriver = () => {
    changePageState("FORM");
    changeFormState("ADD");
  };

  const handleCancelAddDriver = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
  };

  const handleEditDriver = (data) => {
    setFormData(data);
    changePageState("FORM");
    changeFormState("EDIT");
  };

  const handleCancelEditDriver = () => {
    changePageState("LIST");
    changeFormState(null);
  };

  const handleSubmitDriver = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
  };

  return pageState === "LIST" ? (
    <AdminDriverList
      onAddDriver={handleAddDriver}
      onEditDriver={handleEditDriver}
    />
  ) : (
    <AdminDriverForm
      formState={formState}
      formData={formData}
      onSubmitDriver={handleSubmitDriver}
      onCancelAddDriver={handleCancelAddDriver}
      onCancelEditDriver={handleCancelEditDriver}
    />
  );
};

export default AdminDrivers;
