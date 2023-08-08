import React, { useState, useEffect } from "react";
import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => setLoading(false), 2500)
    }, [])

    return (
        <div>
            <Head>
                <title>StreamWeave</title>
                <meta name="description" content="Decentralised Video Streaming Platform" />
            </Head>

            <div className='font-montserrat'>
                <Navbar />
                <main>{children}</main>
            </div>
        </div>
    )
}
