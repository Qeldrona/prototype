import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Hello from "./api/hello";
import getConfig, { setConfig } from 'next/config';
import { publicRuntimeConfig } from "../next.config"

const { serverRuntimeConfig } = getConfig()
var newPublicRuntimeConfig = {
  // Will be available on both server and client
  staticFolder: '/static',
  setViaSetConfig: true
}

import {
  useEffect,
} from "react";


export default function Home(props) {
  useEffect(() => {
    const worker = new Worker(new URL('/deep.thought.js', import.meta.url));
    worker.postMessage({
      question:
        'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
    });
    worker.onmessage = ({ data: { answer } }) => {
      console.log(answer);
    };
  }, []);
  if(typeof window !== undefined){
    setConfig(newPublicRuntimeConfig);
    console.log(publicRuntimeConfig)
  }
  console.log(props.json)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const json = await Hello.getName(context.req, context.res);
  return {
    props: {
      revalidate: 0,
      json: json
    }, // will be passed to the page component as props
  }
}

// export async function getStaticProps(context) {
//   const response = await Hello;
//   console.log(response);
//   return {
//     props: {
//       revalidate: 5,
//     }, // will be passed to the page component as props
//   }
// }