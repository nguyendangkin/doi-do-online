import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ReactNode } from "react";
interface AppProps {
    children: ReactNode;
}

function App({ children }: AppProps) {
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-2">{children}</main>
            <Footer />
        </>
    );
}

export default App;
