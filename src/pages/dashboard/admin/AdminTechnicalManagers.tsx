import AdminTechnicalManagerForm from "./layouts/AdminTechnicalManagerForm";
import AdminTechnicalManagersList from "./layouts/AdminTechnicalManagersList";
import AdminFormState from "./types/admin-form-states.type";
import AdminPageStates from "./types/admin-page-states.type";
import { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";

const AdminTechnicalManagers: FC = () => {
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

  const handleAddTechnicalManager = () => {
    changePageState("FORM");
    changeFormState("ADD");
  };

  const handleCancelAddTechnicalManager = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
  };

  const handleEditTechnicalManager = (data) => {
    setFormData(data);
    changePageState("FORM");
    changeFormState("EDIT");
  };

  const handleCancelEditTechnicalManager = () => {
    changePageState("LIST");
    changeFormState(null);
  };

  const handleSubmitTechnicalManager = () => {
    clearCreateParam();
    changePageState("LIST");
    changeFormState(null);
  };

  return pageState === "LIST" ? (
    <AdminTechnicalManagersList
      onAddTechnicalManager={handleAddTechnicalManager}
      onEditTechnicalManager={handleEditTechnicalManager}
    />
  ) : (
    <AdminTechnicalManagerForm
      formState={formState}
      formData={formData}
      onSubmitTechnicalManager={handleSubmitTechnicalManager}
      onCancelAddTechnicalManager={handleCancelAddTechnicalManager}
      onCancelEditTechnicalManager={handleCancelEditTechnicalManager}
    />
  );
};

export default AdminTechnicalManagers;
