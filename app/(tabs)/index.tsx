import { useAuthStore } from "@/stores/authStore";
import AdminPortal from "@/portals/AdminPortal";
import StudentPortal from "@/portals/StudentPortal";

export default function Index() {
  // const { isAdmin, name, logout } = useAuthStore();

  const isAdmin = false;

  return ( isAdmin ? <AdminPortal /> : <StudentPortal />)
}
