import AdminGuard from "./AdminGuard";

export default function AdminLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}