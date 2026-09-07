import AdminCompanyForm from "./layouts/AdminCompanyForm";
import AdminCompanyList from "./layouts/AdminCompanyList";
import AdminFormState from "./types/admin-form-states.type";
import AdminPageStates from "./types/admin-page-states.type";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const AdminCompanies = () => {
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

  const handleAddCompany = () => {
    changePageState("FORM");
    changeFormState("ADD");
    setFormData(null);
  };

  const handleCancelAddCompany = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
    setFormData(null);
  };

  const handleEditCompany = (data) => {
    setFormData(data);
    changePageState("FORM");
    changeFormState("EDIT");
  };

  const handleCancelEditCompany = () => {
    changePageState("LIST");
    changeFormState(null);
  };

  const handleSubmitCompany = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
  };

  return pageState === "LIST" ? (
    <AdminCompanyList
      onAddCompany={handleAddCompany}
      onEditCompany={handleEditCompany}
    />
  ) : (
    <AdminCompanyForm
      formState={formState}
      formData={formData}
      onSubmitCompany={handleSubmitCompany}
      onCancelAddCompany={handleCancelAddCompany}
      onCancelEditCompany={handleCancelEditCompany}
    />
  );
};

export default AdminCompanies;
