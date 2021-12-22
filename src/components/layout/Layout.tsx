import React from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import Header from "./Header";
import classes from "./Layout.module.css";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      <MainNavigation />
      {children && <main className={classes.main}>{children}</main>}
      <Footer />
    </div>
  );
}

export default Layout;
