import React from 'react';
import Head from 'next/head';
export default function Header() {
    return (
        <Head>
            <title>We Met</title>
            <meta name="description" content="Connect with people you meet at festivals" />
            <link rel="shortcut icon" href="/circle.png" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#F5722F" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="We Met" />
        </Head>
    )
}