import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <Navbar /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
