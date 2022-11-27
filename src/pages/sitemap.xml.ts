import { urlStringFormatter } from "../lib/utils";

const EXTERNAL_DATA_URL = process.env.NEXT_PUBLIC_API_URL;
const APP_URL = "https://www.juliebaronniebeauty.com";

function generateSiteMap(posts, items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${APP_URL}</loc>
     </url>
      <url>
       <loc>${APP_URL}/blog</loc>
     </url>
     ${posts
       .map(({ id, attributes }) => {
         return `
       <url>
           <loc>${`${APP_URL}/blog/${urlStringFormatter(
             attributes.Name,
             id
           )}`}</loc>
       </url>
     `;
       })
       .join("")}
       <url>
        <loc>${APP_URL}/products</loc>
       </url>
       ${items
         .map(({ id }) => {
           return `
       <url>
           <loc>${`${APP_URL}/products/${id}`}</loc>
       </url>
     `;
         })
         .join("")}
        <url>
            <loc>${APP_URL}/login</loc>
       </url>
        <url>
            <loc>${APP_URL}/login/lost-password</loc>
       </url>
       <url>
            <loc>${APP_URL}/login/reset-password</loc>
       </url>
       <url>
            <loc>${APP_URL}/auth/signin</loc>
       </url>
       <url>
            <loc>${APP_URL}/search</loc>
       </url>
       <url>
            <loc>${APP_URL}/signup</loc>
       </url>
       <url>
            <loc>${APP_URL}/mentions-legales</loc>
       </url>
       <url>
            <loc>${APP_URL}/api/auth</loc>
       </url>
       <url>
            <loc>${APP_URL}/api/articles-index</loc>
       </url>
       <url>
            <loc>${APP_URL}/api/products-index</loc>
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
    `${EXTERNAL_DATA_URL}/articles?pagination[pageSize]=100`
  );
  const responsePosts = await requestPosts.json();
  const posts = responsePosts.data;

  // items
  const requestItems = await fetch(
    `${EXTERNAL_DATA_URL}/items?pagination[pageSize]=100`
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
