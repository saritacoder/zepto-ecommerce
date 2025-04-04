

import Header from "./Header";
import Footer from "./Footer";


const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
 
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

   
      <Footer />
    </div>
  );
};

export default Layout;
