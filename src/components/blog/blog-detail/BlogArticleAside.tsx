import classes from "./BlogArticleAside.module.css";
import Link from "next/link";
import { Field, Form, Formik } from "formik";
import {
  Icon,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Image from "next/image";
import { Article } from "../BlogArticleItem";
import { BsTwitter, BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { FaRss } from "react-icons/fa";
import { useState } from "react";
import { urlStringFormatter } from "../../../lib/utils";

function BlogAside(props: { articles: Article[] }) {
  // const api_url = "https://jbb-admin.herokuapp.com";

  const newDate = (date) => {
    const mois = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const nDate = new Date(date);
    return `${nDate.getDate()} ${
      mois[nDate.getMonth()]
    } ${nDate.getFullYear()}`;
  };

  function SideBlogDetail({ article }) {
    const articleUrl = urlStringFormatter(article.title, article.id);

    return (
      <li>
        <Link href={`/blog/${articleUrl}`}>
          <a className={classes.imgctr}>
            <Image
              src={article.imageUrl}
              alt={article.title}
              width="100%"
              height="100%"
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
        <div className={classes.recentpostdetails}>
          <Link href={`/blog/${articleUrl}`}>
            <a>{article.title}</a>
          </Link>
          <div>
            <div>{newDate(article.issueDate)}</div>
            <span> / </span>
            <div>0 Comments</div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            <Link href="https://www.youtube.com/channel/UCvVIi4gAhSC4x7sM3g9q53w">
              <a>
                <li>
                  <Icon as={BsYoutube} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link href="https://www.facebook.com/groups/3136931483299677">
              <a>
                <li>
                  <Icon as={BsFacebook} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link href="https://www.instagram.com/julie_baronnie/">
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
        {/* <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Newsletter</h4>
          <div className={classes.newsletter}>
            <div className={classes.newslettertxt}>
              Recevez mes dernières nouvelles directement sur votre boîte mail
            </div>
            <Formik
              initialValues={{ email: "" }}
              onSubmit={() => console.log("email submitted")}
            >
              {(props) => (
                <Form>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl>
                        <FormLabel htmlFor="email" />
                        <InputGroup size="md">
                          <Input
                            {...field}
                            variant="filled"
                            id="email"
                            placeholder="Adresse mail"
                          />
                          <InputRightElement width="4.5rem">
                            <Button colorScheme="blackAlpha" type="submit">
                              OK
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </div>
        </div> */}
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Articles récents</h4>
          <ul className={classes.sidebarlist}>
            <SideBlogDetail article={props.articles[0]} />
            <SideBlogDetail article={props.articles[1]} />
            <SideBlogDetail article={props.articles[2]} />
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default BlogAside;
