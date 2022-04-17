import classes from "./MainNavigation.module.css";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Icon,
  Button,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

let mounted = false;
function MainNavigation() {
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { data: session, status } = useSession();

  useEffect(() => {
    mounted = true;
  }, []);

  if (mounted) {
    return (
      <header className={classes.header}>
        <div className={classes.row}>
          <div className={`${classes.small} ${classes.column}`}>
            <IconButton
              size="sm"
              ml={2}
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
                      <Link href="/blog">
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
                      <Link href="/products">
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
          <div className={`${classes.small} ${classes.column}`}>
            <div className={classes.logowrapper}>
              <Link href="/">
                <a>
                  <p className={classes.logo}>JBBeauty</p>
                </a>
              </Link>
            </div>
          </div>
          <div
            className={`${classes.small} ${classes.column}`}
            style={{ flexFlow: "row-reverse" }}
          >
            <div className={classes.secondaryarea}>
              <div className={classes.rightcontainers}>
                <Link href={"/search"}>
                  <a>
                    <IconButton
                      aria-label="Search database"
                      colorScheme="white"
                      color="black"
                      size="sm"
                      icon={<SearchIcon w={5} h={5} />}
                      mr={2}
                    />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {isLargerThan1024 ? (
          <div className={classes.row}>
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
        ) : null}
      </header>
    );
  }
  return null;
}

export default MainNavigation;
