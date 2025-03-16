import Image from "next/image";
import Link from "next/link";
import img from "../../../components/imgs/mrigal.png";
function Header() {
  return (
    <header className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src={img} alt="My logo" />
        </Link>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="flex flex-row justify-between">
      <div className="justify-start flex flex-row ">©2025 SarlDigitservZ</div>
      <div className="justify-end flex flex-row gap-8 mr-10">
        <Link className="hover:text-blue-900 " href="/contact">
          Contact
        </Link>
      </div>
    </footer>
  );
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </section>
  );
}
