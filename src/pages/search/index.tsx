import SearchApp from "../../components/search/SearchApp";
import Head from "next/head";

const SearchPage = () => {
  return (
    <>
      <Head>
        <title>Recherche - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Search page"
        />
      </Head>
      <SearchApp />
    </>
  );
};

export default SearchPage;
