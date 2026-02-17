import { notFound } from "next/navigation";
import Script from "next/script";
import { getMessages } from "next-intl/server";
import { locales, isRtl } from "@/i18n/config";
import IntlErrorHandlingProvider from "@/components/IntlErrorHandlingProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HashScroll from "@/components/HashScroll";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieBanner from "@/components/CookieBanner";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "../globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
      <body className="font-sans antialiased">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              `}
            </Script>
            <GoogleAnalytics />
          </>
        )}
        <StructuredData />
        <IntlErrorHandlingProvider locale={locale} messages={messages}>
          <HashScroll />
          <Navbar />
          <main className="min-h-screen flex flex-col" style={{ paddingTop: "5rem" }}>
            {children}
          </main>
          <Footer locale={locale} />
          <CookieBanner />
          <WhatsAppFloat />
        </IntlErrorHandlingProvider>
      </body>
    </html>
  );
}
