import Head from "next/head";
import { ReactNode } from "react";
type ViewLayout = {
  title: string;
  children: ReactNode;
  desc: string;
};

const ViewPortflioLayout = ({ title, children, desc }: ViewLayout) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc ?? ""} />
      </Head>

      <div>{children}</div>
    </div>
  );
};

export default ViewPortflioLayout;
