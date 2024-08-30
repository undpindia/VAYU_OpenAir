import Header from '../Header/Header';

const Layout = ({ children, toggleMenu, isActive }) => {
  return (
    <div className="min-h-screen no-scrollbar">
      <Header isActive={isActive} toggleMenu={toggleMenu} />
      <main className="px-10 sm:px-12 md:px-16 lg:px-20 xl:px-24 no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default Layout;

//px-10 sm:px-12 md:px-16 lg:px-20 xl:px-24
