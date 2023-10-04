import type { NextPage } from "next";
import Head from "next/head";
import { TestPhantomView } from "../views";

const Test: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <TestPhantomView />
    </div>
  );
};

export default Test;
