import React from 'react';
import Plyr from 'plyr';

const VideoCard = ({ title, amount, videoSrc, onClick, isExpanded }) => {
    React.useEffect(() => {
        const player = new Plyr(`#plyr-${title.replace(/\s+/g, '-')}`);
        return () => {
            player.destroy();
        };
    }, [title]);

    return (
        // <div className="bg-white shadow-md rounded-md py-1 px-4 w-1/4 my-4">
        <div className={`bg-white shadow-md rounded-md py-1 px-4 my-4 ${isExpanded ? 'order-1 w-3/4' : 'w-1/4'}`}
            style={{ minWidth: isExpanded ? '60%' : 'auto' }}
            onClick={onClick}>
            <div className="mt-4">
                <video src={videoSrc} controls></video>
            </div>
            <h2 className="text-lg font-semibold pt-2 pb-1">{title}</h2>
            <div className="flex items-center py-1">
                {amount === 0 ? (
                    <div className="bg-green-400 text-white px-2 py-1 rounded-md">
                        FREE
                    </div>
                ) : (
                    <div className="flex items-center">
                        <span className="text-lg">{amount}</span>
                        <span className="ml-1">ETH</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCard;
