"use client"

import React, { useState } from 'react';
import UploadCrypto from './uploadCrypto';
import UploadOthent from './uploadOthent';

export default function TabsPage() {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className=''>

            <div className="flex flex-col items-center mt-8">

                <div className="flex space-x-8 border-2 border-white rounded-lg px-4 py-2">
                    <button
                        className={`px-4 py-2 rounded-lg ${activeTab === 'tab1' ? 'bg-secondary text-white' : 'bg-gray-200'}`}
                        onClick={() => handleTabClick('tab1')}
                    >
                        Using Othent
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${activeTab === 'tab2' ? 'bg-secondary text-white' : 'bg-gray-200'}`}
                        onClick={() => handleTabClick('tab2')}
                    >
                        Using Crypto Wallet
                    </button>
                </div>

            </div>

                <div className="mt-4 mx-12">
                    {activeTab === 'tab1' && <div className='w-full '><UploadOthent /></div>}
                    {activeTab === 'tab2' && <div><UploadCrypto /></div>}
                </div>
        </div>
    );
}
