import { Outlet } from "react-router";

const Student = () => {
    return (
        
  <div className="min-h-screen flex flex-col">
<main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>


    );
};

export default Student;