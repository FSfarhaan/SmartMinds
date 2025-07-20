
import AdminPortal from "../../portals/AdminPortal"
import StudentPortal from "../../portals/StudentPortal";

export default function Index() {
  // const { isAdmin, name, logout } = useAuthStore();

  const isAdmin = true;

  return ( isAdmin ? <AdminPortal /> : <StudentPortal />)
}
