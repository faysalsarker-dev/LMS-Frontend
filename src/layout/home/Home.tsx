import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Outlet } from "react-router";

const Home = () => {
    return (
        
  <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
    </div>


    );
};

export default Home;