import { useGetCitiesQuery } from "../../../api/Categories/Location";
import { useChangePasswordMutation, useEditProfileMutation, useGetProfileQuery, useProfileApiMutation } from "../../../api/Profile/Profile";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import ImageComponent from "../../../components/shared/Image/Image";
import CustomeAutoComplete from "../../../components/shared/Inputs/CustomeAutoComplete";
import SkeletonCondition from "../../../components/shared/SkeletonCondition";
import { STORAGE_URL } from "../../../Stores/api-urls";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { clear, setPersonalData, setProfileImage, setRoles, setToken } from "../../../Stores/slices/user";
import { ProfileDataType } from "../../../types/ProfileType";
import { compressImage } from "../../../utilities/compress-image";
import imageToBase64 from "../../../utilities/imageToBase64";
import EditNumber from "./EditNumberDialog";
import { Button, Divider, TextField } from "@mui/material";
import { AddCircle, Edit, ProfileCircle, Slash, TickSquare, Trash, User } from "iconsax-reactjs";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiUploadCloudFill } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";





















































const Profile: FC<{ isNewUser?: boolean }> = ({ isNewUser }) => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const phone = useAppSelector((state) => state.user.phone);
  const roles = useAppSelector((state) => state.user.roles);
  const userID = useAppSelector((state) => state.user.userID);
  const profileImage = useAppSelector((state) => state.user.profileImage);

  const [changeProfileInfo, setChangeProfileInfo] = useState(false);
  const [user] = useState<any>(undefined);
  const [openEditNumberProfile, setOpenEditNumberProfile] =
    useState<boolean>(false);

  const profileImageInput = useRef<HTMLInputElement>(null);

  const isRegister = useMemo(
    () => searchParams.get("register") !== null,
    [searchParams],
  );

  const getProfileDataApi = useGetProfileQuery(undefined, {
    skip: isRegister || isNewUser,
  });

  const {
    register,
    watch,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors, touchedFields },
  } = useForm<ProfileDataType>();

  const { citySearch } = useWatch({ control });

  useEffect(() => {
    searchParams.get("edit") != null && setChangeProfileInfo(true);
  }, [searchParams]);

  useEffect(() => {
    if (getProfileDataApi.isSuccess) {
      const image = getProfileDataApi.data.data.user.images.find(
        (item: any) => item.image_type === "profile",
      )?.url;
      const obj = {
        ...getProfileDataApi.data.data.user.personal,
        has_associations: getProfileDataApi.data.data.has_associations,
        phone:
          getProfileDataApi.data.data.user.personal?.phone ||
          getProfileDataApi.data.data.user.username,
      };

      reset({
        ...obj,
        image: STORAGE_URL + image,
      });
      dispatch(setPersonalData(obj));
      dispatch(setProfileImage(image ? `${STORAGE_URL}${image}` : ""));
    } else {
      setValue("phone", phone!);
      setValue("user_id", userID!);
    }
  }, [getProfileDataApi.data, getProfileDataApi.isSuccess, userID, phone]);

  const [profileFn, profileResult] = useProfileApiMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (profileResult.isSuccess) {
      SweetAlertToast.fire({
        icon: "success",
        title: `${profileResult.data.message}`,
      });
      dispatch(clear());
      dispatch(setToken(profileResult.data.data.token));
      const roles = [];
      roles.push(profileResult.data.data.roles[0].role);
      dispatch(setRoles(roles));
      dispatch(setPersonalData({ ...profileResult.data.data.data.personal }));
      searchParams.delete("register");
      navigate("/dashboard");
    }
  }, [profileResult, getProfileDataApi, searchParams]);

  const [changePasswordFn, changePasswordResult] = useChangePasswordMutation();

  useEffect(() => {
    changePasswordResult.isSuccess &&
      SweetAlertToast.fire({
        icon: "success",
        title: changePasswordResult.data?.message,
      });
  }, [changePasswordResult]);

  const [editProfileFn, editProfileResult] = useEditProfileMutation();

  useEffect(() => {
    if (editProfileResult.isSuccess) {
      // @ts-ignore
      const data = editProfileResult.data as any;
      SweetAlertToast.fire({
        icon: "success",
        title: data.message,
      });
      const personal = {
        ...data.data.personal,
        images: data.data.images,
        has_associations: data.data.has_associations,
      };
      dispatch(setPersonalData(personal));
      const profileImage = data.data.images.find(
        (ele: any) => ele.image_type === "profile",
      )?.url;
      dispatch(
        setProfileImage(profileImage ? `${STORAGE_URL}${profileImage}` : ""),
      );

      setChangeProfileInfo(false);
    }
  }, [editProfileResult]);

  const cities = useGetCitiesQuery({
    query: citySearch,
  });

  const handleSubmitProfileData = async (changePasswordSubmitted?: boolean) => {
    if (isRegister || isNewUser) {
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
        profileFn(formData);
      }
    } else {
      if (watch("isChangePass") && changePasswordSubmitted) {
        const passwordValidation = await trigger([
          "password_confirmation",
          "password",
          "old_password",
        ]);
        if (passwordValidation) {
          changePasswordFn({
            current_password: watch("old_password"),
            password: watch("password"),
            password_confirmation: watch("password_confirmation"),
          });
        }
      } else {
        const formData = new FormData();
        const keys = [
          "phone",
          "national_code",
          "father_name",
          "full_name",
          "address",
          "telephone",
          "email",
        ];
        for (const key of keys) {
          // @ts-ignore
          if (key === "email" && (watch(key) === null || watch(key) === ""))
            continue;
          formData.append(key, watch()[key]);
        }
        if (touchedFields?.image) {
        } else if (!touchedFields?.image) {
          formData.delete("image");
        }
        if (profileImageInput.current?.files?.length)
          formData.append(
            "image",
            await compressImage(profileImageInput.current.files[0], {
              fileType: "image/jpeg",
              maxSizeMB: 1,
              maxIteration: 20,
              useWebWorker: true,
            }),
          );
        formData.append(
          "birthdate",
          watch("birthdate") ? watch("birthdate")!.toString() : "",
        );
        formData.append("city_code", watch("cities")?.code);
        formData.append("_method", "PUT");
        editProfileFn(formData);
      }
    }
  };

  const handleAddProfileImage = () => {
    profileImageInput.current?.click();
  };

  const handleSetProfileImage = async () => {
    //@ts-ignore
    dispatch(
      setProfileImage(await imageToBase64(profileImageInput.current.files[0])),
    );
  };

  const handleRemoveProfileImage = () => {
    dispatch(setProfileImage(""));
  };

  return (
    <div className={"w-full h-max"}>
      {openEditNumberProfile && (
        <EditNumber
          open={openEditNumberProfile}
          setOpen={setOpenEditNumberProfile}
        />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ProfileCircle size="32" className="text-primary" />
          <h1 className="font-bold  text-xl">پروفایل کاربر</h1>
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center gap-4">
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              className="p-2"
            >
              {!(isRegister || isNewUser) &&
                (changeProfileInfo ? (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      color="secondary"
                      startIcon={<Slash />}
                      onClick={() => setChangeProfileInfo(false)}
                    >
                      انصراف
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      startIcon={<TickSquare />}
                      onClick={() => handleSubmitProfileData(false)}
                      loading={editProfileResult.isLoading}
                    >
                      تایید
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    className="bg-yellow-500"
                    startIcon={<Edit />}
                    onClick={() => setChangeProfileInfo(true)}
                  >
                    ویرایش
                  </Button>
                ))}
            </SkeletonCondition>
          </div>
        </div>
      </div>
      <div className="mx-3 my-8 flex md:flex-row flex-col gap-4 gap-y-9 justify-start">
        <div className="flex flex-col gap-y-9 grow">
          <p className="lg:mr-80">
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
              {changeProfileInfo &&
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
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
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
                disabled={!(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                label="نام و نام خانوادگی"
                required
                error={!!errors.full_name}
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                label="نام پدر"
                required
                error={!!errors.father_name}
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                label="شماره ثابت"
                error={!!errors.telephone}
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                label="ایمیل"
                error={!!errors.email}
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <DatePickerComponent
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
                name="birthdate"
                label="تاریخ تولد"
                control={control}
                autoComplete="off"
                disableFuture={true}
                rules={{
                  required: "این فیلد الزامی است",
                }}
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <CustomeAutoComplete
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                label="آدرس"
                className="md:col-span-full md:col-start-2"
                disabled={!changeProfileInfo && !(isRegister || isNewUser)}
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
            </SkeletonCondition>
          </div>
          <div className="flex flex-col space-y-6">
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
              variant="text"
              className="w-60 h-10"
            >
              {(isRegister || isNewUser) && (
                <h2 className="font-semibold text-[2vw] md:text-[0.9vw] text-[#9da6ad]">
                  یک رمز عبور برای کاربری خود وارد کنید
                </h2>
              )}
            </SkeletonCondition>
            {(isRegister || isNewUser) && (
              <div className="flex flex-col md:flex-row md:items-start gap-y-6 gap-x-6">
                {!(isRegister || isNewUser) && (
                  <SkeletonCondition
                    loading={
                      getProfileDataApi.isLoading ||
                      getProfileDataApi.isFetching
                    }
                  >
                    <TextField
                      label="رمز عبور فعلی"
                      type="password"
                      required
                      {...register("old_password", {
                        required: "فیلد رمز عبور الزامی است .",
                        validate: (value: string) =>
                          value.length > 3 ||
                          "طول رمز عبور حداقل باید ۴ کاراکتر باشد .",
                      })}
                      error={!!errors.old_password}
                      helperText={errors.old_password?.message}
                      autoComplete="off"
                      slotProps={{
                        htmlInput: {
                          autoComplete: "off",
                        },
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </SkeletonCondition>
                )}
                <SkeletonCondition
                  loading={
                    getProfileDataApi.isLoading || getProfileDataApi.isFetching
                  }
                >
                  <TextField
                    label="رمز عبور"
                    type="password"
                    required
                    {...register("password", {
                      required: "فیلد رمز عبور الزامی است .",
                      validate: (value: string) =>
                        value.length > 3 ||
                        "طول رمز عبور حداقل باید ۴ کاراکتر باشد .",
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="off"
                    slotProps={{
                      htmlInput: {
                        autoComplete: "off",
                      },
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </SkeletonCondition>

                <SkeletonCondition
                  loading={
                    getProfileDataApi.isLoading || getProfileDataApi.isFetching
                  }
                >
                  <TextField
                    label="تکرار رمز عبور"
                    type="password"
                    required
                    autoComplete="off"
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation?.message}
                    {...register("password_confirmation", {
                      required: "فیلد تکرار رمز عبور الزامی است .",
                      validate: (value: string) =>
                        value === watch("password") ||
                        "تکرار رمز عبور با رمز عبور برابر نیست .",
                    })}
                    slotProps={{
                      htmlInput: {
                        autoComplete: "off",
                      },
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </SkeletonCondition>

                <SkeletonCondition
                  loading={
                    getProfileDataApi.isLoading || getProfileDataApi.isFetching
                  }
                >
                  <Button
                    loading={
                      profileResult.isLoading ||
                      changePasswordResult.isLoading ||
                      editProfileResult.isLoading
                    }
                    variant="contained"
                    onClick={() => handleSubmitProfileData(true)}
                    className="flex items-center justify-between"
                  >
                    {searchParams.get("register") ? (
                      <p>ثبت نام</p>
                    ) : (
                      <p>ثبت تغییرات</p>
                    )}
                    <FaArrowLeftLong />
                  </Button>
                </SkeletonCondition>
              </div>
            )}
          </div>
        </div>
      </div>
      {!(isRegister || isNewUser) &&
        roles &&
        roles.find((item) => item.name === "technicalManager") && (
          <>
            <div className={"flex flex-row items-center"}>
              <span className={" font-extrabold text-[150%]"}>
                گواهینامه ها
              </span>
              <Divider className={"border-b border-[#e5e5e5] grow mx-4"} />
            </div>
            <SkeletonCondition
              loading={
                getProfileDataApi.isLoading || getProfileDataApi.isFetching
              }
            >
              <div
                className={
                  "custom-dash-bold select-none cursor-pointer " +
                  "rounded-lg transition-all duration-200 " +
                  "ease-in flex flex-col gap-4 items-center justify-center p-4 px-8 transit-background"
                }
              >
                <div className={"custom-dash-lg p-6 relative z-10"}>
                  <RiUploadCloudFill className={"w-8 h-8 scale-x-[-1]"} />
                  <div className="absolute w-[0.6rem] h-[0.6rem] rounded-full bg-primary right-1.5 top-2 z-0"></div>
                  <div className="absolute w-3 h-3 rounded-full bg-primary left-1 bottom-[0.8rem] z-0"></div>
                </div>
                <div className={"flex flex-row items-center gap-3"}>
                  <div className={"bg-primary rounded-full w-3 h-3"}></div>
                  <span className={" font-semibold"}>
                    افزودن گواهینامه جدید
                  </span>
                </div>
              </div>
            </SkeletonCondition>

            <div className={"flex flex-row flex-wrap gap-4 p-2"}>
              {user &&
                user?.images
                  ?.filter((ele: any) =>
                    ["passenger", "freighter", "licence"].includes(
                      ele.image_type,
                    ),
                  )
                  .map((item: any, index: number) => {
                    // if (item?.image_type !== "licence") return null;
                    return (
                      <div
                        key={index + 1}
                        className={
                          "basis-[37%] min-w-[450px] border border-gray-300 rounded-lg h-1/2 p-1 relative"
                        }
                      >
                        <img
                          src={STORAGE_URL + item?.url}
                          alt={"Random pic"}
                          width={1}
                          height={1}
                          className={"w-full h-[400px] rounded-lg"}
                        />
                        <div
                          className={
                            "absolute bg-primary rounded-lg p-1 px-4 " +
                            "shadow-[0_4px_15px_rgba(0,0,0,0.4)] " +
                            "right-4 bottom-4  font-extrabold tracking-tight text-[80%]"
                          }
                        >
                          {item?.title}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </>
        )}
    </div>
  );
};

export default Profile;
