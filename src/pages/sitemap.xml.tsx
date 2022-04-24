import { urlStringFormatter } from "../lib/utils";

const EXTERNAL_DATA_URL = "https://www.juliebaronniebeauty.com";

function generateSiteMap(posts, items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
     </url>
      <url>
       <loc>${EXTERNAL_DATA_URL}/blog</loc>
     </url>
     ${posts
       .map(({ id, attributes }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/blog/${urlStringFormatter(
             attributes.Name,
             id
           )}`}</loc>
       </url>
     `;
       })
       .join("")}
       <url>
        <loc>${EXTERNAL_DATA_URL}/products</loc>
       </url>
       ${items
         .map(({ id }) => {
           return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/products/${id}`}</loc>
       </url>
     `;
         })
         .join("")}
        <url>
            <loc>${EXTERNAL_DATA_URL}/login</loc>
       </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/login/lost-password</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/login/reset-password</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/auth/signin</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/search</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/signup</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/mentions-legales</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/api/auth</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/api/articles-index</loc>
       </url>
       <url>
            <loc>${EXTERNAL_DATA_URL}/api/products-index</loc>
       </url>
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  // posts
  const requestPosts = await fetch(
    "https://jbbeauty-cms.herokuapp.com/api/articles"
  );
  const responsePosts = await requestPosts.json();
  const posts = responsePosts.data;

  // items
  const requestItems = await fetch(
    "https://jbbeauty-cms.herokuapp.com/api/items"
  );
  const responseItems = await requestItems.json();
  const items = responseItems.data;

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts, items);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
