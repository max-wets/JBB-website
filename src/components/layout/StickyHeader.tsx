import classes from "./StickyHeader.module.css";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  IconButton,
  useDisclosure,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

function Header() {
  const oldScrollY = useRef(0);
  const [direction, setDirection] = useState("top");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { data: session, status } = useSession();

  const controlDirection = useCallback(() => {
    if (window.scrollY > oldScrollY.current) {
      setDirection("down");
    } else if (window.scrollY < 180) {
      setDirection("top");
    } else {
      setDirection("up");
    }
    oldScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", controlDirection);
    return () => {
      window.removeEventListener("scroll", controlDirection);
    };
  }, [controlDirection]);

  return (
    <header
      className={
        direction === "top" || direction === "down"
          ? `${classes.header} ${classes.hide}`
          : classes.header
      }
    >
      <div className={classes.row}>
        <div>
          <IconButton
            size="sm"
            aria-label="hamburger menu button"
            colorScheme="white"
            color="black"
            icon={<Icon as={GiHamburgerMenu} w={6} h={6} />}
            ref={btnRef}
            onClick={onOpen}
          />
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader
                className={classes.logo}
                style={{ fontSize: "34px" }}
                borderBottomWidth="1px"
              >
                JBBeauty
              </DrawerHeader>
              <DrawerBody>
                <ul className={classes.drawermenu}>
                  <li>
                    <Link href={"/blog"}>
                      <a>
                        <Button
                          size="sm"
                          colorScheme="white"
                          color="black"
                          onClick={onClose}
                        >
                          <p>BLOG</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/products"}>
                      <a>
                        <Button
                          size="sm"
                          colorScheme="white"
                          color="black"
                          onClick={onClose}
                        >
                          <p>PRODUITS</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    {status === "authenticated" ? (
                      <Button
                        size="sm"
                        colorScheme="white"
                        color="black"
                        onClick={() => signOut({ redirect: false })}
                      >
                        <p>SE DECONNECTER</p>
                      </Button>
                    ) : (
                      <Button size="sm" colorScheme="white" color="black">
                        <Link href={"/auth/signin"}>
                          <a>
                            <p>SE CONNECTER</p>
                          </a>
                        </Link>
                      </Button>
                    )}
                  </li>
                </ul>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
        <div className={`${classes.large} ${classes.column}`}>
          <div className={classes.navbar}>
            <nav>
              <ul className={classes.fullmenu}>
                <li>
                  <Link href={"/blog"}>
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>BLOG</p>
                      </Button>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={"/products"}>
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>PRODUITS</p>
                      </Button>
                    </a>
                  </Link>
                </li>
                <li>
                  {status === "authenticated" ? (
                    <Button
                      size="sm"
                      colorScheme="white"
                      color="black"
                      onClick={() => signOut({ redirect: false })}
                    >
                      <p>SE DECONNECTER</p>
                    </Button>
                  ) : (
                    <Button size="sm" colorScheme="white" color="black">
                      <Link href={"/auth/signin"}>
                        <a>
                          <p>SE CONNECTER</p>
                        </a>
                      </Link>
                    </Button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
