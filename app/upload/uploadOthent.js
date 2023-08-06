"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Othent } from 'othent';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr';

export default function uploadOthent() {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [walletAdd, setWalletAdd] = useState('');
    const [description, setDescription] = useState('');
    const [paymentOption, setPaymentOption] = useState('free');
    const [selectedVideoPreview, setSelectedVideoPreview] = useState(null);
    const [amount, setAmount] = useState('');

    const [othent, setOthent] = useState('')
    const [user, setUser] = useState()
    const [txId, setTxId] = useState("")

    useEffect(() => {
        const initializeOthent = async () => {
            const othentInstance = await Othent({ API_ID: 'd7a29242f7fdede654171a0d3fd25163' });
            setOthent(othentInstance);
        };
        initializeOthent();
    }, []);

    useEffect(() => {
        const player = new Plyr('#player');
        return () => {
            player.destroy();
        };
    }, []);

    async function logIn() {
        const userDetails = await othent.logIn()
        setUser(userDetails)
        console.log('User details:', userDetails)
    }

    async function logOut() {
        const logOutResponse = await othent.logOut()
        setUser(null)
        setTxId("")
        console.log('logOut Response:', logOutResponse)
    }

    async function uploadFile(event) {
        const file = event.target.files[0];
        console.log('Uploaded file:', file);

        if (!file) return;

        const signedFile = await othent.signTransactionBundlr({
            othentFunction: 'uploadData',
            data: file,
            tags: [{ name: "Content-Type", value: file.type }]
        });
        console.log('Signed file:', signedFile)

        const transaction = await othent.sendTransactionBundlr(signedFile);
        console.log('Transaction', transaction)

        if (transaction.success)
            setTxId(transaction.transactionId)


        const selectedVideo = event.target.files[0];
        setVideo(selectedVideo);

        if (selectedVideo) {
            const videoURL = URL.createObjectURL(selectedVideo);
            setSelectedVideoPreview(videoURL);
        } else {
            setSelectedVideoPreview(null);
        }
    }

    const handleVideoChange = (event) => {
        const selectedVideo = event.target.files[0];
        setVideo(selectedVideo);

        if (selectedVideo) {
            const videoURL = URL.createObjectURL(selectedVideo);
            setSelectedVideoPreview(videoURL);
        } else {
            setSelectedVideoPreview(null);
        }
    };



    const handlePaymentOptionChange = (event) => {
        setPaymentOption(event.target.value);
    };

    return (
        <div className='grid place-items-center pb-20 pt-12'>

            {!user ? (
                <div className="mt-36">
                    <button className='flex flex-row space-x-2 bg-white text-xl px-4 py-2 rounded-lg' onClick={logIn}>Log In using Google
                        <Image src="/google_icon-iconscom_62736.png" className='ml-2' height={12} width={25} /> </button>
                </div>
            ) : (
                <div className=''>

                    <h1 className='text-center text-xl text-white'>Hello, {user.name}</h1>

                    <div className='float-right space-y-2'>
                        <div className='flex flex-row items-center justify-center space-x-2 pt-2'>
                            <h1 className='text-center text-md text-white'>{user.email}</h1>
                            <img src={user.picture} alt="avatar" className='mt-1 h-6 w-6 rounded-full' width={40} height={40} />
                        </div>
                        <button className='float-right bg-secondary text-[1rem] text-white px-2 py-1 rounded-md ' onClick={logOut}>Log Out</button>
                    </div>

                    <div>

                        <div className="relative min-w-[80vw] flex mx-auto mt-32 bg-white z-40 border border-gray-300 rounded shadow-md">
                            {/* Left Column */}
                            <div className="flex-1 pr-8 z-40 p-4 bg-white">
                                <h1 className="text-xl font-semibold mb-4">Upload Video</h1>

                                <div className="mb-4 grid">
                                    <label htmlFor="video" className="block font-medium">
                                        Select Video:
                                    </label>
                                    <input
                                        type="file"
                                        id="video"
                                        accept="video/*"
                                        onChange={uploadFile} disabled={!user}
                                    />

                                    <a href={`https://arweave.net/${txId}`} className='text-sm' alt="" target="_blank" rel="noreferrer">Uploaded: File Link: https://arweave.net/${txId}</a>
                                </div>


                                {selectedVideoPreview && (
                                    <div className="mb-4">
                                        <video className="w-full rounded-xl" id="player" controls playsInline>
                                            <source src={selectedVideoPreview} type="video/mp4" />
                                        </video>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="flex-1 pl-8 pt-16 z-40 p-4 bg-white">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-medium">
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium">
                                        Description:
                                    </label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-medium">
                                        Wallet Address:
                                    </label>
                                    <input
                                        type="text"
                                        id="walletAdd"
                                        value={walletAdd}
                                        onChange={(e) => setWalletAdd(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium">Payment Option:</label>
                                    <select
                                        value={paymentOption}
                                        onChange={handlePaymentOptionChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    >
                                        <option value="free">Free</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>

                                {paymentOption === 'paid' && (
                                    <div className="mb-4">
                                        <label htmlFor="amount" className="block font-medium">
                                            Amount (ETH):
                                        </label>
                                        <input
                                            type="number"
                                            id="amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                        Upload
                                    </button>
                                </div>
                            </div>
                            <svg class="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-gray-200 fill-current" viewBox="0 0 91 91" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" stroke-width="1" fill-rule="evenodd">
                                    <g fill-rule="nonzero">
                                        <g>
                                            <g>
                                                <circle cx="3.261" cy="3.445" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.445" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.445" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.445" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.445" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.445" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.445" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.445" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 12)">
                                                <circle cx="3.261" cy="3.525" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.525" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.525" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.525" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.525" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.525" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.525" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.525" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 24)">
                                                <circle cx="3.261" cy="3.605" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.605" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.605" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.605" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.605" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.605" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.605" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.605" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 36)">
                                                <circle cx="3.261" cy="3.686" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.686" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.686" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.686" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.686" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.686" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.686" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.686" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 49)">
                                                <circle cx="3.261" cy="2.767" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.767" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.767" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.767" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.767" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.767" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.767" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.767" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 61)">
                                                <circle cx="3.261" cy="2.846" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.846" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.846" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.846" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.846" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.846" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.846" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.846" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 73)">
                                                <circle cx="3.261" cy="2.926" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.926" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.926" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.926" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.926" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.926" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.926" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.926" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 85)">
                                                <circle cx="3.261" cy="3.006" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.006" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.006" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.006" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.006" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.006" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.006" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.006" r="2.719"></circle>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                            <svg class="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-blue-600 fill-current" viewBox="0 0 91 91" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" stroke-width="1" fill-rule="evenodd">
                                    <g fill-rule="nonzero">
                                        <g>
                                            <g>
                                                <circle cx="3.261" cy="3.445" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.445" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.445" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.445" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.445" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.445" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.445" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.445" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 12)">
                                                <circle cx="3.261" cy="3.525" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.525" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.525" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.525" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.525" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.525" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.525" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.525" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 24)">
                                                <circle cx="3.261" cy="3.605" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.605" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.605" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.605" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.605" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.605" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.605" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.605" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 36)">
                                                <circle cx="3.261" cy="3.686" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.686" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.686" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.686" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.686" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.686" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.686" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.686" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 49)">
                                                <circle cx="3.261" cy="2.767" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.767" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.767" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.767" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.767" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.767" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.767" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.767" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 61)">
                                                <circle cx="3.261" cy="2.846" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.846" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.846" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.846" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.846" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.846" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.846" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.846" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 73)">
                                                <circle cx="3.261" cy="2.926" r="2.72"></circle>
                                                <circle cx="15.296" cy="2.926" r="2.719"></circle>
                                                <circle cx="27.333" cy="2.926" r="2.72"></circle>
                                                <circle cx="39.369" cy="2.926" r="2.72"></circle>
                                                <circle cx="51.405" cy="2.926" r="2.72"></circle>
                                                <circle cx="63.441" cy="2.926" r="2.72"></circle>
                                                <circle cx="75.479" cy="2.926" r="2.72"></circle>
                                                <circle cx="87.514" cy="2.926" r="2.719"></circle>
                                            </g>
                                            <g transform="translate(0 85)">
                                                <circle cx="3.261" cy="3.006" r="2.72"></circle>
                                                <circle cx="15.296" cy="3.006" r="2.719"></circle>
                                                <circle cx="27.333" cy="3.006" r="2.72"></circle>
                                                <circle cx="39.369" cy="3.006" r="2.72"></circle>
                                                <circle cx="51.405" cy="3.006" r="2.72"></circle>
                                                <circle cx="63.441" cy="3.006" r="2.72"></circle>
                                                <circle cx="75.479" cy="3.006" r="2.72"></circle>
                                                <circle cx="87.514" cy="3.006" r="2.719"></circle>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
}
