import classes from "./LostPwdHeading.module.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { BiHomeHeart } from "react-icons/bi";

function LostPwdHeading() {
  return (
    <header className={classes.pageheader}>
      <div className={classes.container}>
        <h1>Mon compte</h1>
        <Breadcrumb
          spacing="1px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem h="24px" position="relative" top="3px">
            <BreadcrumbLink href="/" _hover={{ color: "#D93644" }}>
              <Icon as={BiHomeHeart} h={6} w={6} size="sm" pt="4px" />
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem h="24px">
            <BreadcrumbLink
              fontSize="13px"
              href="/login"
              _hover={{ textDecoration: "none", color: "#D93644" }}
            >
              Connexion
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage h="24px">
            <BreadcrumbLink
              fontSize="13px"
              href="#"
              _hover={{ textDecoration: "none", color: "#D93644" }}
            >
              Mot de passe perdu
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default LostPwdHeading;
