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
  !user.isVerified
) {
  navigate('/access-denied')
}


if(requiredRole?.length && !requiredRole.includes(user.role)){
    navigate('/unauthorized')

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
