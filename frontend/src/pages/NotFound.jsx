import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-4xl font-bold text-blue-700">404 — Page not found</h2>
      <p className="mt-4 text-gray-600">The page you requested does not exist.</p>
      <Link to="/" className="inline-block mt-6 bg-blue-700 text-white px-4 py-2 rounded">Back to Home</Link>
    </section>
  );
}
