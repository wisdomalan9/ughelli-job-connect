import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
