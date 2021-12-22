import classes from "./Footer.module.css";
import Link from "next/link";
import { Field, Form, Formik } from "formik";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { AiFillYoutube, AiFillFacebook } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";

function Footer() {
  return (
    <footer>
      <div>
        <div className={classes.footertop}>
          <div className={classes.container}>
            <div className={classes.footerbox}>
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
                              placeholder="Saisissez votre adresse mail ici"
                            />
                            <InputRightElement width="4.5rem">
                              <Button colorScheme="blackAlpha" type="submit">
                                Envoyer
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
            <div className={classes.footerbox}>
              <div>
                <Link href="">
                  <a>
                    <p className={classes.footertitle}>JBBeauty</p>
                  </a>
                </Link>
              </div>
              <div>
                <Link href="">
                  <a>
                    <IconButton
                      aria-label="lien youtube"
                      colorScheme="white"
                      color="black"
                      size="sm"
                      icon={<Icon as={AiFillYoutube} w={6} h={6} />}
                      _hover={{ color: "#D93644" }}
                    />
                  </a>
                </Link>
                <Link href="">
                  <a>
                    <IconButton
                      aria-label="lien youtube"
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
            <div className={classes.footerbottommenu}>
              <div>
                <ul>
                  <li>
                    <Link href="">
                      <a>
                        <span>Confidentialité</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <span>Mentions Légales</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <span>CGV</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={classes.copyright}>
              @ 2022 | JBBeauty. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
