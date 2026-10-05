import { Link } from "react-router-dom";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";

const NotFound = () => {
  return (
    <Layout>
      <PageMeta
        title="Page Not Found | GoSendeet"
        description="This page could not be found. Browse GoSendeet to compare courier prices or track your delivery."
        path="/404"
        noIndex
      />
      <div className="flex flex-col items-center justify-center text-center md:px-20 px-6 py-24 md:py-36">
        <p className="text-6xl font-bold text-green-800 mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-green-800 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            to="/cost-calculator"
            className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Get a delivery quote
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
