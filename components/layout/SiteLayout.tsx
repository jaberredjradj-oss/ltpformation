import { Suspense } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnnouncementMount } from "@/components/announcement/AnnouncementMount";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[96px] sm:pt-[104px] md:pt-[124px] lg:pt-[176px]">{children}</main>
      <Footer />
      <Suspense fallback={null}>
        <AnnouncementMount />
      </Suspense>
    </>
  );
}
