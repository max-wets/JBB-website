import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";

const theme = extendTheme({
  components: { Button: { baseStyle: { _focus: { boxShadow: "none" } } } },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
