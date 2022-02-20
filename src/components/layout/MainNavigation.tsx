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
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

function MainNavigation() {
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { data: session, status } = useSession();

  return (
    <header className={classes.header}>
      <div className={classes.row}>
        <div className={`${classes.small} ${classes.column}`}>
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
                    <Link href="/blog">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>BLOG</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/products">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>PRODUITS</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>SE CONNECTER</p>
                        </Button>
                      </a>
                    </Link>
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
                <p className={classes.logo} style={{ fontSize: "50px" }}>
                  JBBeauty
                </p>
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
                    icon={<SearchIcon w={4} h={4} />}
                  />
                </a>
              </Link>
            </div>
            {isLargerThan750 ? (
              <div className={classes.rightcontainers}>
                <Menu>
                  <MenuButton
                    colorScheme="white"
                    color="black"
                    size="sm"
                    as={Button}
                    rightIcon={<ChevronDownIcon w={5} h={5} paddingTop={1} />}
                    className={classes.menuhover}
                    // _focus={{ boxShadow: "none" }}
                  >
                    <p style={{ fontSize: "16px" }}>SUIVRE</p>
                  </MenuButton>
                  <MenuList>
                    <MenuItem>YOUTUBE</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ) : null}
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

export default MainNavigation;
