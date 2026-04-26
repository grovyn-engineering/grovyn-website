import { Poppins } from "next/font/google";
import "../globals.css";
import AdminChrome from "./AdminChrome";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function AdminHtmlLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-sans antialiased`}>
        <AdminChrome>{children}</AdminChrome>
      </body>
    </html>
  );
}
