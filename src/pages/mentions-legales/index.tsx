import LegalNoticeComponent from '@/application/components/legal-notice/LegalNoticeComponent';
import Head from 'next/head';

function LegalNoticePage() {
  return (
    <>
      <Head>
        <title>Mentions légales - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Legal notice page"
        />
      </Head>
      <LegalNoticeComponent />
    </>
  );
}

export default LegalNoticePage;
