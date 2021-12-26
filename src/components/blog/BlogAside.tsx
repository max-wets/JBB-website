import classes from "./BlogAside.module.css";
import Link from "next/link";
import { Icon } from "@chakra-ui/react";
import { BsTwitter, BsFacebook, BsInstagram } from "react-icons/bs";
import { FaRss } from "react-icons/fa";

function BlogAside() {
  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            <Link href="">
              <a>
                <li>
                  <Icon as={BsTwitter} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link href="">
              <a>
                <li>
                  <Icon as={BsFacebook} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link href="">
              <a>
                <li>
                  <Icon as={BsInstagram} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link href="">
              <a>
                <li>
                  <Icon as={FaRss} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        <div className={classes.sidebox}></div>
        <div className={classes.sidebox}></div>
        <div className={classes.sidebox}></div>
      </div>
    </aside>
  );
}

export default BlogAside;
