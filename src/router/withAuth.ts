import React, { useEffect } from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { LoadingSkeleton } from "@/components/admin/course/LoadingSkeleton";
import { useNavigate, useParams } from "react-router";

type TRole = "student" | "instructor" | "admin" | "super_admin";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: TRole[],
  course?: boolean
) => {
  const AuthWrapper: React.FC<P> = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useUserInfoQuery(undefined);

    const user = data?.data;

    useEffect(() => {
      if (isLoading) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      if (!user.isActive || !user.isVerified) {
        navigate("/access-denied", { replace: true });
        return;
      }

      if (requiredRole?.length && !requiredRole.includes(user.role)) {
        navigate("/unauthorized", { replace: true });
        return;
      }

      if (course && id) {
        const check = user.courses?.includes(id as string);
        if (!check) {
          navigate("/unauthorized", { replace: true });
          return;
        }
      }
    }, [user, isLoading, navigate, id]);

    if (isLoading || !user) {
      return React.createElement(LoadingSkeleton);
    }

    if (!user.isActive || !user.isVerified) {
      return null;
    }

    if (requiredRole?.length && !requiredRole.includes(user.role)) {
      return null;
    }

    if (course && id && !user.courses?.includes(id as string)) {
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
