import ContactForm from "../components/Common/ContactForm";

export default function Contact() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Contact Us</h2>
      <p className="text-center text-gray-600 mb-6">Have a question or want to report an issue? Send us a message.</p>
      <ContactForm />
    </section>
  );
}
