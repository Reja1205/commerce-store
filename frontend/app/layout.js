

import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Ecommerce App",
  description: "Next.js + Express + MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}