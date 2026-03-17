import Sidebar from "../components/Common/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
}
