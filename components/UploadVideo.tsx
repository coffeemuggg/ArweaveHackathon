import { useState, useRef } from "react";
import { Web3Storage } from "web3.storage";
import { useBundler } from '@/state/bundlr.context';
import axios from 'axios';

const apiToken = process.env.NEXT_PUBLIC_WEB3_STORAGE;

function makeGatewayURLImage(vidCID, vidName) {
    return `https://${vidCID}.ipfs.w3s.link/${vidName}`;
}

interface PostData {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    wallet_address: string;
}
export default function Home() {
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [videoCID, setVideoCID] = useState(null);
    const [videoURL, setVideoURL] = useState(null);

    const { balance, uploadFile } = useBundler();
    const [URI, setURI] = useState('')
    const [file, setFile] = useState<Buffer>()
    const [image, setImage] = useState('')
    const hiddenFileInput = useRef(null);

    const [postData, setPostData] = useState<PostData>({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        wallet_address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!videoURL || !URI) {
            console.log("Video and thumbnail are required.");
            return;
        }
    
        const postDataToSend = {
            title: postData.title,
            description: postData.description,
            video_url: videoURL,
            thumbnail_url: URI,
            wallet_address: postData.wallet_address,
        };
    
        try {
            const response = await axios.post('/api/createPost', postDataToSend);
            console.log('Response from createPost:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPostData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    function onFileChange(e: any) {
        const file = e.target.files[0]
        if (file) {
            const image = URL.createObjectURL(file)
            setImage(image)
            let reader = new FileReader()
            reader.onload = function () {
                if (reader.result) {
                    setFile(Buffer.from(reader.result as any))
                }
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const onFileChangeVI = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("video/")) {
            setUploadedVideo(selectedFile);
            handleVideoUpload(selectedFile);
        }
    };

    const handleUpload = async () => {
        const res = await uploadFile(file);
        console.log('res.data', res.data);
        setURI(`http://arweave.net/${res.data.id}`)
    }

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleVideoUpload = async (videoFile) => {
        if (videoFile) {
            const client = new Web3Storage({ token: apiToken });

            const vidCID = await client.put([videoFile], { name: videoFile.name });
            console.log("vidCID: ", vidCID);
            setVideoCID(vidCID);

            const url = makeGatewayURLImage(vidCID, videoFile.name);
            setVideoURL(url);
        }
    };

    return (
        <div className="mx-8 md:mx-36 grid place-items-center">
            <form onSubmit={handleSubmit} className="min-w-[70vw] mx-4 p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
                <div className="flex">
                    {/* Left Column */}
                    <div className="flex-1 pr-8">
                        <div className="mb-4 grid">
                            <label htmlFor="video" className="block font-medium">
                                Select Video:
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={onFileChangeVI}
                            />
                            <input className="hidden" value={videoURL} />

                        </div>
                        {videoURL && (
                            <div className="mb-4">
                                <video className="w-full rounded-xl" id="player" controls playsInline>
                                    <source src={videoURL} type="video/mp4" />
                                </video>
                            </div>
                        )}

                        <label onClick={handleClick} htmlFor="video" className="block font-medium">
                            Select Thumbnail:
                        </label>
                        <input
                            accept="image/png, image/gif, image/jpeg"
                            type="file"
                            ref={hiddenFileInput}
                            onChange={onFileChange}
                        />

                        {image && (
                            <div>
                                <button className='bg-tertiary text-lg text-white rounded-xl px-4 py-2 mt-4' onClick={handleUpload}>
                                    Upload Media
                                </button>
                            </div>
                        )}
                        <input className="hidden" value={URI} />

                        {
                            URI && <div className='mt-4'>
                                <img className="w-44 h-32 object-cover rounded-xl" src={URI} />
                            </div>
                        }
                    </div>
                    {/* Right Column */}
                    <div className="flex-1 pl-8">
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-medium">
                                Title:
                            </label>
                            <input
                                type="text"
                                id="title" required
                                name="title" value={postData.title} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block font-medium">
                                Description:
                            </label>
                            <textarea
                                id="description" required
                                // @ts-ignore
                                name="description" value={postData.description} onChange={handleChange}
                                className="w-full min-h-[16rem] border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-medium">
                                Wallet Address:
                            </label>
                            <input
                                type="text"
                                id="walletAdd" required
                                name="wallet_address" value={postData.wallet_address} onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid place-items-center">
                    <button
                        type="submit"
                        className={`bg-secondary text-white px-4 py-2 rounded ${(!videoURL || !URI) && 'opacity-50 cursor-not-allowed'}`}
                        disabled={!videoURL || !URI}
                    >
                        Upload Video
                    </button>
                </div>
            </form>
        </div>
    );
}
