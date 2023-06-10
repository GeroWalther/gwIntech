import React from "react";

const Layout = ({ children, className }) => {
  return (
    <div
      className={`w-full h-full inline-block z-0 bg-light p-16 xl:p-14 lg:p-12 md:p-10 sm:p-6 xs:p-4  ${className}`}
    >
      {children}
    </div>
  );
};

export default Layout;
