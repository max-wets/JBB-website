import classes from "./MainNavigation.module.css";
import Link from "next/link";
import { useRef } from "react";
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
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { GiHamburgerMenu } from "react-icons/gi";

function MainNavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

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
              >
                JBBeauty
              </DrawerHeader>
              <DrawerBody></DrawerBody>
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
              <IconButton
                aria-label="Search database"
                colorScheme="white"
                color="black"
                size="sm"
                icon={<SearchIcon w={4} h={4} />}
              />
            </div>
            <div className={classes.rightcontainers}>
              <Menu>
                <MenuButton
                  colorScheme="white"
                  color="black"
                  size="sm"
                  as={Button}
                  rightIcon={<ChevronDownIcon w={5} h={5} paddingTop={1} />}
                  // _focus={{ boxShadow: "none" }}
                >
                  <p style={{ fontSize: "16px" }}>SUIVRE</p>
                </MenuButton>
                <MenuList>
                  <MenuItem>YOUTUBE</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={`${classes.large} ${classes.column}`}>
          <div className={classes.navbar}></div>
        </div>
      </div>
    </header>
  );
}

export default MainNavigation;
