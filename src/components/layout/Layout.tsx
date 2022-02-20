import React, { useEffect, useState } from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import StickyHeader from "./StickyHeader";
import classes from "./Layout.module.css";
import { useSession } from "next-auth/react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const { data: session, status } = useSession();
  const [connected, setConnected] = useState(null);
  const [AlertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      setConnected(true);
      console.log("you're authenticated");
    } else {
      setConnected(false);
      console.log("you're not authenticated");
    }
  }, [status]);

  useEffect(() => {
    setAlertMessage(
      <Alert
        status="success"
        position="absolute"
        justifyContent="space-between"
        transition="all 1s"
      >
        <AlertIcon />
        {connected
          ? "Vous êtes maintenant connecté !"
          : "Vous avez été déconnecté !"}
        <CloseButton
          position="relative"
          top="-6px"
          onClick={() => setAlertMessage(null)}
        />
      </Alert>
    );
    setTimeout(() => setAlertMessage(null), 5000);
  }, [connected]);

  return (
    <div>
      {AlertMessage ? AlertMessage : null}
      <StickyHeader />
      <MainNavigation />
      {children && <main className={classes.main}>{children}</main>}
      <Footer />
    </div>
  );
}

export default Layout;
