import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Litmus — Validate Your Project Idea",
  description: "AI-powered academic validator for student developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}