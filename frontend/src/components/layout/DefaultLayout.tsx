import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-2">{children}</main>
            <Footer />
        </>
    );
}
