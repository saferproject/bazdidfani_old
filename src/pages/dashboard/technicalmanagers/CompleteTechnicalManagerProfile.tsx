import { useGetCitiesQuery } from "../../../api/Categories/Location";
import { useCompleteNewTechManagerProfileMutation } from "../../../api/TechnicalManager/TechnicalManager";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import ImageComponent from "../../../components/shared/Image/Image";
import CustomeAutoComplete from "../../../components/shared/Inputs/CustomeAutoComplete";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { setNewTechnicalManagetData, setProfileImage } from "../../../Stores/slices/user";
import { ProfileDataType } from "../../../types/ProfileType";
import { compressImage } from "../../../utilities/compress-image";
import imageToBase64 from "../../../utilities/imageToBase64";
import { Button, TextField } from "@mui/material";
import { AddCircle, ProfileCircle, Slash, TickSquare, Trash, User } from "iconsax-reactjs";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

const CompleteTechnicalManagerProfile: FC<{ isNewUser?: boolean }> = ({ isNewUser }) => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const phone = useAppSelector((state) => state.user.phone);
  const userID = useAppSelector((state) => state.user.userID);
  const profileImage = useAppSelector((state) => state.user.profileImage);

  const [changeProfileInfo, setChangeProfileInfo] = useState(false);

  const profileImageInput = useRef<HTMLInputElement>(null);

  const {
    register,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<ProfileDataType>();

  const { citySearch } = useWatch({ control });

  useEffect(() => {
    searchParams.get("edit") != null && setChangeProfileInfo(true);
  }, [searchParams]);

  useEffect(() => {
    setValue("phone", phone!);
    setValue("user_id", userID!);
  }, [userID, phone]);

  const [profileFn, profileResult] = useCompleteNewTechManagerProfileMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (profileResult.isSuccess) {
      SweetAlertToast.fire({
        icon: "success",
        title: `${profileResult.data.message}`,
      });
      // @ts-ignore
      dispatch(setNewTechnicalManagetData({ ...watch() }));
      navigate("/dashboard/technicalmanagers/inquery-technical-manager");
    }
  }, [profileResult, searchParams]);

  const cities = useGetCitiesQuery({
    query: citySearch,
  });

  const handleSubmitProfileData = async (changePasswordSubmitted?: boolean) => {
    const validation = await trigger();
    if (validation) {
      const formData = new FormData();
      for (const item of Object.keys(watch())) {
        if (item === "email" && (watch(item) === null || watch(item) === ""))
          continue;
        // @ts-ignore
        formData.append(item, watch(item));
      }
      if (profileImageInput.current?.files?.length)
        formData.set(
          "image",
          await compressImage(profileImageInput.current.files[0], {
            fileType: "image/jpeg",
            maxSizeMB: 1,
            maxIteration: 20,
            useWebWorker: true,
          }),
        );
      else formData.set("image", "");
      formData.set(
        "birthdate",
        watch("birthdate") ? watch("birthdate")!.toString() : "",
      );
      formData.set("city_code", watch("cities")?.code);
      // @ts-ignore
      profileFn(formData);
    }
  };

  const handleAddProfileImage = () => {
    profileImageInput.current?.click();
  };

  const handleSetProfileImage = async () => {
    //@ts-ignore
    dispatch(
      setProfileImage(await imageToBase64(profileImageInput.current.files[0]) as string),
    );
  };

  const handleRemoveProfileImage = () => {
    dispatch(setProfileImage(""));
  };

  return (
    <div className={"w-full h-max"}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ProfileCircle size="32" className="text-primary" />
          <h1 className="font-bold  text-xl">پروفایل کاربر</h1>
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center gap-4">
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      color="secondary"
                      disabled={profileResult.isLoading}
                      startIcon={<Slash />}
                      onClick={() => navigate("/dashboard/technicalmanagers/add-technicalmanager")}
                    >
                      انصراف
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      loading={profileResult.isLoading}
                      startIcon={<TickSquare />}
                      onClick={() => handleSubmitProfileData(false)}
                    >
                      تایید
                    </Button>
                  </>
          </div>
        </div>
      </div>
      <div className="mx-3 my-8 flex md:flex-row flex-col gap-4 gap-y-9 justify-start">
        <div className="flex flex-col gap-y-9 grow">
          <p className="mr-80">
            اطلاعات شخصی خودتان را به عنوان کاربر سامانه وارد نمایید
          </p>
          <div className="lg:grid lg:grid-cols-5 lg:grid-rows-3 lg:gap-4 flex flex-col w-full gap-4">
            <div className="w-32 h-32 row-span-3 flex items-center justify-center relative rounded-full m-auto overflow-hidden border border-gray-400">
              <input
                ref={profileImageInput}
                type="file"
                className="hidden"
                onInput={handleSetProfileImage}
              />
              <ImageComponent
                image={profileImage}
                placeholder={<User size="60" />}
                alt="عکس پروفایل"
                width="w-32"
                height="h-32"
              />
              {
                (profileImage ? (
                  <Button
                    className="absolute bottom-0 bg-red-500/20 w-full"
                    onClick={handleRemoveProfileImage}
                  >
                    <Trash size="24" className="text-red-500" />
                  </Button>
                ) : (
                  <Button
                    className="absolute bottom-0 bg-primary/20 w-full"
                    onClick={handleAddProfileImage}
                  >
                    <AddCircle size="24" className="text-primary" />
                  </Button>
                ))}
            </div>
              <TextField
                label="نام کاربری و شماره همراه"
                error={!!errors.phone}
                disabled={true}
                required
                helperText={errors.phone?.message}
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("phone", {
                  required: "این فیلد الزامی است",
                  minLength: {
                    value: 11,
                    message: "شماره تلفن همراه باید 11 رقم باشد.",
                  },
                  maxLength: {
                    value: 11,
                    message: "شماره تلفن همراه باید 11 رقم باشد.",
                  },
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 11) value = value.slice(0, 11);
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <TextField
                fullWidth
                label="کد ملی"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                autoFocus
                required
                error={!!errors.national_code}
                autoComplete="off"
                helperText={errors.national_code?.message}
                {...register("national_code", {
                  required: "فیلد کدملی الزامی است .",
                  maxLength: { value: 10, message: "کد ملی باید 10 رقم باشد" },
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 10) value = value.slice(0, 10);
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <TextField
                label="نام و نام خانوادگی"
                required
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("full_name", {
                  required: "فیلد نام و نام خانوادگی الزامی است .",
                  maxLength: {
                    value: 64,
                    message: "طول حداکثر 64 حرف میتواند باشد.",
                  },
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\d/g, "");
                  if (value.length > 64) value = value.slice(0, 64);
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <TextField
                label="نام پدر"
                required
                error={!!errors.father_name}
                helperText={errors.father_name?.message}
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("father_name", {
                  required: "فیلد نام پدر الزامی است.",
                  maxLength: {
                    value: 32,
                    message: "حداکثر طول باید 32 حرف باشد.",
                  },
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\d/g, "");
                  if (value.length > 32) value = value.slice(0, 32);
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <TextField
                label="شماره ثابت"
                error={!!errors.telephone}
                helperText={errors.telephone?.message}
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("telephone", {
                  minLength: {
                    value: 11,
                    message: "شماره ثابت باید ۱۱ رقم باشد",
                  },
                  maxLength: 11,
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 11) value = value.slice(0, 11);
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <TextField
                label="ایمیل"
                error={!!errors.email}
                helperText={errors.email?.message ?? ""}
                type="email"
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("email")}
                onChange={(event) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/^[\u0600-\u06FF\s]/g, "");
                  (event.target as HTMLInputElement).value = value;
                }}
              />
              <DatePickerComponent
                name="birthdate"
                label="تاریخ تولد"
                control={control}
                autoComplete="off"
                disableFuture={true}
                rules={{
                  required: "این فیلد الزامی است",
                }}
              />
              <CustomeAutoComplete
                showField="name"
                name="cities"
                className="md:col-span-1"
                control={control}
                data={cities.data?.data}
                loading={cities.isLoading || cities.isFetching}
                setValue={setValue}
                searchName="citySearch"
                label="شهر"
                rules={{
                  required: "این فیلد الزامی است",
                }}
              />
              <TextField
                label="آدرس"
                className="md:col-span-full md:col-start-2"
                required
                slotProps={{
                  htmlInput: {
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                error={!!errors.address}
                helperText={errors.address?.message}
                {...register("address", {
                  required: "آدرس محل سکونت الزامی است.",
                  maxLength: {
                    value: 1024,
                    message: "حداکثر طول باید 1024 حرف باشد",
                  },
                })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  if (value.length > 1024) value = value.slice(0, 1024);
                  (event.target as HTMLInputElement).value = value;
                }}
                fullWidth
                autoComplete="off"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteTechnicalManagerProfile;
