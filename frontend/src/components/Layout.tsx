import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

function Layout ({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Head>
        <title>Hubla</title>
      </Head>
      <header className="bg-white text-black py-4 px-8 flex items-center justify-between ">
        <h1 className="text-xl font-semibold mr-auto">
          <Link href="/">
            Hubla Challenge
          </Link>
        </h1>
        <nav className="flex gap-4">
          <Link href="/upload" className="hover:text-blue-600">
            Upload
          </Link>
          <Link href="/affiliate" className="hover:text-blue-600">
            Affiliate
          </Link>
          <Link href="/creator" className="hover:text-blue-600">
            Creator
          </Link>
          <Link href="/transactions" className="hover:text-blue-600">
            Product Transactions
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
