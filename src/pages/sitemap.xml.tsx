const EXTERNAL_DATA_URL = "http://www.juliebaronniebeauty.com";

function generateSiteMap(posts, items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>http://www.juliebaronniebeauty.com</loc>
     </url>
      <url>
       <loc>http://www.juliebaronniebeauty.com/blog</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/blog/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
       <url>
        <loc>http://www.juliebaronniebeauty.com/products</loc>
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
    "https://jbbeauty-cms.herokuapp.com/api/articles"
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
