import classes from "./Header.module.css";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Icon,
  Accordion,
  AccordionItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
  const oldScrollY = useRef(0);
  const [direction, setDirection] = useState("up");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const controlDirection = useCallback(() => {
    if (window.scrollY > oldScrollY.current && window.scrollY > 180) {
      setDirection("down");
    } else if (
      window.scrollY < oldScrollY.current &&
      oldScrollY.current < 180
    ) {
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
                    <Link href="">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>BLOG</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>MES CODES PROMOS</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Accordion allowToggle>
                      <AccordionItem style={{ borderWidth: 0 }}>
                        <AccordionButton
                          size="sm"
                          colorScheme="white"
                          color="black"
                          minH="32px"
                          _focus={{ boxShadow: "none" }}
                          _hover={{ backgroundColor: "white" }}
                          className={classes.menuhover}
                        >
                          <p>MES FORMATIONS</p>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <ul className={classes.accordionlist}>
                            <li>
                              <Link href="#">
                                <a>
                                  <Button
                                    size="sm"
                                    colorScheme="white"
                                    color="black"
                                  >
                                    <p>EBOOK</p>
                                  </Button>
                                </a>
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <a>
                                  <Button
                                    size="sm"
                                    colorScheme="white"
                                    color="black"
                                  >
                                    <p>FORMAT LIVRE</p>
                                  </Button>
                                </a>
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <a>
                                  <Button
                                    size="sm"
                                    colorScheme="white"
                                    color="black"
                                  >
                                    <p>WEBINAR</p>
                                  </Button>
                                </a>
                              </Link>
                            </li>
                          </ul>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </li>
                  <li>
                    <Link href="#">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>MA SELECTION DE PRODUITS</p>
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <a>
                        <Button size="sm" colorScheme="white" color="black">
                          <p>INFORMATIONS</p>
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
        <div className={`${classes.large} ${classes.column}`}>
          <div className={classes.navbar}>
            <nav>
              <ul className={classes.fullmenu}>
                <li>
                  <Link href="">
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>BLOG</p>
                      </Button>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>MES CODES PROMOS</p>
                      </Button>
                    </a>
                  </Link>
                </li>
                <li>
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="sm"
                      colorScheme="white"
                      color="black"
                      rightIcon={<ChevronDownIcon />}
                      className={classes.menuhover}
                    >
                      <p>MES FORMATIONS</p>
                    </MenuButton>
                    <MenuList>
                      <MenuItem minH="30px" ml="8px">
                        <p>EBOOK</p>
                      </MenuItem>
                      <MenuItem minH="30px" ml="8px">
                        <p>FORMAT LIVRE</p>
                      </MenuItem>
                      <MenuItem minH="30px" ml="8px">
                        <p>WEBINAR</p>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </li>
                <li>
                  <Link href="#">
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>MA SELECTION DE PRODUITS</p>
                      </Button>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a>
                      <Button size="sm" colorScheme="white" color="black">
                        <p>INFORMATIONS</p>
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
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
