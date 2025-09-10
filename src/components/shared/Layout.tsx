import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileAppBar } from './MobileAppBar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileAppBar />
    </div>
  );
};