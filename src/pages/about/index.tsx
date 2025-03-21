import AboutComponent from "../../components/about/AboutComponent";
import Head from "next/head";

function AboutPage() {
  return (
    <>
      <Head>
        <title>A propos - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the About page"
        />
      </Head>
      <AboutComponent />
    </>
  );
}

export default AboutPage;
