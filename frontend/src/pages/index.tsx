import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';

function Home () {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Hubla Challange</h1>
        <h2 className="text-lg">
          Shall we begin by importing your transactions?
        </h2>
        <Link href={'/upload'}
          className="text-black font-bold text-lg px-6 py-3 border-2  rounded-lg hover:bg-green-900  transition duration-300 ease-in-out mt-6"
          style={{ backgroundColor: '#D8F55F' }}
        >
          Upload file
        </Link>
      </div>
    </Layout>
  );
}

export default Home;