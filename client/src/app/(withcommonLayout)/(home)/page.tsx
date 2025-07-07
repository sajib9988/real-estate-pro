
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/homesection/Footer";
import Property from "@/homesection/Property";




export default function Home() {
  return (
    <main className="">
          <Property></Property>
          <Footer></Footer>
 <Toaster />
    </main>
  );
}