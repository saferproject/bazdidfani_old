import empty_car_plate from "../../../assets/images/empty_car_plate.png";
import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";

type iprops = {
  firstChar: number;
  secondChar: string;
  thirdChar: string;
  fourthChar: string;
  maxWidth?: number;
};

const Plate: FC<iprops> = ({
  firstChar,
  fourthChar,
  secondChar,
  thirdChar,
  maxWidth = 180,
}) => {
  const [PlateColors, setPlateColors] = useState({
    backColor: "#FDCB18",
    color: "#000",
  });

  useEffect(() => {
    if (secondChar === "" || secondChar === " ") {
      setPlateColors({ backColor: "transparent", color: "inherit" });
    } else if (["ت", "ع", "ک"].includes(secondChar)) {
      setPlateColors({ backColor: "#FDCB18", color: "#000" });
    } else if (["ش", "پ", "ث"].includes(secondChar)) {
      setPlateColors({ backColor: "#01542A", color: "#FFFFFF" });
    } else if (secondChar === "ا") {
      setPlateColors({ backColor: "#ED1C24", color: "#FFFFFF" });
    } else {
      setPlateColors({ backColor: "#FFFFFF", color: "#000" });
    }
  }, [secondChar]);
  return (
    <Stack
      //   width={"100%"}
      alignItems={"center"}
    >
      <Stack
        width={"100%"}
        maxWidth={maxWidth}
        sx={{
          position: "relative",
          fontWeight: 700,
          backgroundColor: PlateColors.backColor,
          color: PlateColors.color,
          borderRadius: "4px",
        }}
      >
        <Stack>
          <img
            src={empty_car_plate}
            alt=""
            className="rounded-[5px] xl:w-56 lg:w-48 md:w-36 w-28"
          />
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            top: "0",
            bottom: 0,
            width: "100%",
          }}
          direction={"row-reverse"}
          alignItems={"center"}
        >
          <Stack width={"10%"} />
          <Stack width={"27.5%"}>
            <p className="md:text-[20px] text-[12px] font-bold text-center pt-1 md:pt-0">
              {firstChar}
            </p>
          </Stack>

          <Stack width={"15%"}>
            <p className="md:text-[20px] text-[12px] font-bold text-center pb-0.5 md:pb-0">
              {secondChar}
            </p>
          </Stack>

          <Stack width={"32.5%"}>
            <p className="md:text-[20px] text-[12px] font-bold text-center pt-1 md:pt-0">
              {thirdChar}
            </p>
          </Stack>

          <Stack width={"25%"}>
            <p
              style={{ color: PlateColors.color }}
              className="md:text-[18px] text-[11px] font-bold text-center md:pt-3 pt-1.5"
            >
              {fourthChar}
            </p>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default Plate;
