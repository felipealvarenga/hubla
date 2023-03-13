import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Head>
        <title>My Next.js App</title>
      </Head>
      <header className="bg-white text-black py-4 px-8 flex items-center justify-between ">
        <h1 className="text-xl font-semibold mr-auto">Hubla Challange</h1>
        <nav className="flex gap-4">
          <Link href="/upload" className="hover:text-blue-600">
            Upload
          </Link>
        </nav>
      </header>
      <main className="flex-grow p-8">{children}</main>
      <footer className="text-white py-4 px-8" style={{ backgroundColor: '#161F00' }}>
        <p>Developed by Felipe Alvarenga &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
}

export default Layout;
