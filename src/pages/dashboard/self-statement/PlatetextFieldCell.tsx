import { FC } from "react";
import { useForm } from "react-hook-form";

import PlateTextField from "../../../components/shared/Inputs/PlateTextField";

const PlateTextFieldCell: FC<any> = ({ row }) => {
  const { control, watch } = useForm({
    defaultValues: {
      first_number: row?.truck?.first_number,
      third_character: row?.truck?.third_character,
      second_number: row?.truck?.second_number,
      fourth_number: row?.truck?.fourth_number,
    },
  });
  
  return (
    <PlateTextField
      control={control}
      watch={watch}
      readOnly={true}
    />
  );
};

export default PlateTextFieldCell;