import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
