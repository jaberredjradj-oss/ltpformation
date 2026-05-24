import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[132px] md:pt-[148px] lg:pt-[200px]">{children}</main>
      <Footer />
    </>
  );
}
