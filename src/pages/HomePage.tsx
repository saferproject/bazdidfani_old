import Body from "../components/Home/Body";
import Footer from "../components/Home/Footer";
import Header from "../components/Home/Header";

export default function HomePage() {
  return (
    <div className={"tablet:py-5 overflow-x-hidden"}>
      <header className={"px-4"}>
        <Header />
      </header>
      <main>
        <Body />
      </main>
      <footer id={"footer"} className={"tablet:px-4"}>
        <Footer />
      </footer>
    </div>
  );
}
