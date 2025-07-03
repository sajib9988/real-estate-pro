import Navbar from "@/form/Navbar";



const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
   
    </>
  );
};

export default CommonLayout;