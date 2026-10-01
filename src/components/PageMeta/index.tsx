import { Helmet } from "react-helmet-async";

const BASE_URL = "https://gosendeet.com";

interface PageMetaProps {
  title: string;
  description: string;
  path: string; // e.g. "/" or "/cost-calculator"
  noIndex?: boolean;
}

const PageMeta = ({ title, description, path, noIndex = false }: PageMetaProps) => {
  const canonical = `${BASE_URL}${path === "/" ? "" : path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default PageMeta;
