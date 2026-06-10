import { Skeleton } from "@mui/material";
import { CommonProps } from "@mui/material/OverridableComponent";
import { FC, ReactNode } from "react";

interface iprops {
  children: ReactNode;
  loading: boolean;
  variant?: "text" | "rectangular" | "rounded-sm" | "circular";
  className?: CommonProps["className"];
}
const SkeletonCondition: FC<iprops> = ({
  children,
  loading,
  variant,
  className,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton
          variant={variant}
          width="100%"
          height="100%"
          className={className}
        >
          {children}
        </Skeleton>
      ) : (
        children
      )}
    </>
  );
};

export default SkeletonCondition;
