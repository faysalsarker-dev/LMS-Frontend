import React from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {LoadingSkeleton} from "@/components/modules/Course/LoadingSkeleton"

type TRole = "student" | "instructor" | "admin" | "super_admin";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: TRole[]
) => {
  const AuthWrapper: React.FC<P> = (props) => {
    const { data, isLoading } = useUserInfoQuery(undefined);

    const user = data?.data;

   

    if (isLoading) return React.createElement(LoadingSkeleton);

if (
  !user?.email ||
  !user.isActive ||
  !user.isVerified ||
  (requiredRole?.length && !requiredRole.includes(user.role))
) {
  return null;
}


    return React.createElement(WrappedComponent, props);
  };

  AuthWrapper.displayName = `withAuth(${getComponentName(WrappedComponent)})`;
  return AuthWrapper;
};

export default withAuth;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponentName(WrappedComponent: React.ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}