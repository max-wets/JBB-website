import classes from "./Footer.module.css";
import Link from "next/link";
import { IconButton, Icon } from "@chakra-ui/react";
import { AiFillYoutube } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";

function Footer() {
  return (
    <footer>
      <div>
        <div className={classes.footertop}>
          <div className={classes.container}>
            <div className={classes.footerbox}>
              <div>
                <Link legacyBehavior href={process.env.NEXT_PUBLIC_APP_URL}>
                  <a>
                    <p className={classes.footertitle}>JBBeauty</p>
                  </a>
                </Link>
              </div>
            </div>

            <div className={classes.footerbox}>
              <div>
                {/* <Link
                  legacyBehavior
                  href="https://www.youtube.com/channel/UCvVIi4gAhSC4x7sM3g9q53w"
                >
                  <a target="_blank">
                    <IconButton
                      aria-label="lien youtube"
                      colorScheme="white"
                      color="black"
                      size="sm"
                      icon={<Icon as={AiFillYoutube} w={6} h={6} />}
                      _hover={{ color: "#D93644" }}
                    />
                  </a>
                </Link> */}
                <Link
                  legacyBehavior
                  href="https://www.facebook.com/groups/3136931483299677"
                >
                  <a target="_blank">
                    <IconButton
                      aria-label="lien facebook"
                      colorScheme="white"
                      color="black"
                      size="sm"
                      icon={<Icon as={BsFacebook} w={5} h={5} />}
                      _hover={{ color: "#D93644" }}
                    />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footerbottom}>
          <div className={classes.footerbottominner}>
            <div className={classes.copyright}>
              Tous droits réservés -{" "}
              <Link legacyBehavior href={"/mentions-legales"}>
                <a>
                  <span>Mentions légales</span>
                </a>
              </Link>{" "}
              - 2025
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
