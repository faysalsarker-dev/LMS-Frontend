import React from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {LoadingSkeleton} from "@/components/modules/Course/LoadingSkeleton"
import { useNavigate, useParams } from "react-router";

type TRole = "student" | "instructor" | "admin" | "super_admin";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: TRole[],
  course?: boolean
) => {
  const AuthWrapper: React.FC<P> = (props) => {
    const {id} = useParams()
const navigate = useNavigate()
const { data, isLoading } = useUserInfoQuery(undefined, {
  refetchOnMountOrArgChange: false,
});


    const user = data?.data;

   

    if (isLoading) return React.createElement(LoadingSkeleton);

if(!user && !isLoading){
  navigate('/login')
}


if (
  !user.isActive ||
  !user.isVerified ||
  (requiredRole?.length && !requiredRole.includes(user.role))
) {
  navigate('/access-denied')
}

if(course && id){
  const check = user?.courses.includes(id as string);
  if(!check){
    return null;
  } 
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

// import React, { useEffect } from "react";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import { LoadingSkeleton } from "@/components/modules/Course/LoadingSkeleton";
// import { Navigate, useParams } from "react-router";

// type TRole = "student" | "instructor" | "admin" | "super_admin";

// const withAuth = <P extends object>(
//   WrappedComponent: React.ComponentType<P>,
//   requiredRole?: TRole[],
//   course?: boolean
// ) => {
//   const AuthWrapper: React.FC<P> = (props) => {
//     const { id } = useParams();
    
//     const { data, isLoading, isError } = useUserInfoQuery(
//       {},
//       {
//         refetchOnMountOrArgChange: false,
//         refetchOnFocus: false,
//         refetchOnReconnect: false,
//       }
//     );

//     const user = data?.data;
//     const isAuthError = isError || data?.success === false;

//     // Debug logging (remove in production)
//     useEffect(() => {
//       console.log('Auth State:', { 
//         isLoading, 
//         isError, 
//         isAuthError,
//         hasUser: !!user,
//         response: data 
//       });
//     }, [isLoading, isError, isAuthError, user, data]);

//     // Show loading state only on initial load
//     if (isLoading) {
//       return React.createElement(LoadingSkeleton);
//     }

//     // Check for auth errors (network error OR api error response)
//     if (isAuthError || !user) {
//       return React.createElement(Navigate, { to: "/login", replace: true });
//     }

//     // Check if user is active and verified
//     if (!user.email || !user.isActive || !user.isVerified) {
//       return React.createElement(Navigate, { to: "/unauthorized", replace: true });
//     }

//     // Check role-based authorization
//     if (requiredRole?.length && !requiredRole.includes(user.role)) {
//       return React.createElement(Navigate, { to: "/unauthorized", replace: true });
//     }

//     // Check course enrollment if required
//     if (course && id) {
//       const hasAccess = user?.courses?.includes(id);
//       if (!hasAccess) {
//         return React.createElement(Navigate, { to: "/unauthorized", replace: true });
//       }
//     }

//     return React.createElement(WrappedComponent, props);
//   };

//   AuthWrapper.displayName = `withAuth(${getComponentName(WrappedComponent)})`;
//   return AuthWrapper;
// };

// export default withAuth;

// function getComponentName(WrappedComponent: React.ComponentType<any>): string {
//   return WrappedComponent.displayName || WrappedComponent.name || "Component";
// }