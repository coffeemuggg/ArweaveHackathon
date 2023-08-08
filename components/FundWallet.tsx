import React, { useState } from 'react';
import { useBundler } from '@/state/bundlr.context';

const FundWallet = () => {
    const { fundWallet, balance } = useBundler();
    const [value, setValue] = useState('0.02');

    return (
        <div className='mt-12'>
            <div className='grid place-items-center'>
                <h1 className='text-xl text-white'>
                    Your current balace is: {balance || 0} MATIC
                </h1>
                <div className='flex flex-row space-x-3 py-2'>
                    <input
                        className='text-lg rounded-lg px-4 py-2'
                        type='number'
                        step='0.01'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button className='bg-secondary text-lg rounded-lg text-white px-4 py-2' onClick={() => fundWallet(+value)}>Add Fund</button>
                </div>
            </div>
        </div>
    );
};

export default FundWallet;
