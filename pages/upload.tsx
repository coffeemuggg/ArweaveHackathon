import React, { useState } from 'react';
import axios from 'axios'; // Install axios if not already done

const CreatePostForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        wallet_address: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/createPost', formData);
            console.log('Post created:', response.data);
            setFormData({
                title: '',
                description: '',
                video_url: '',
                thumbnail_url: '',
                wallet_address: '',
            });
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="Video URL" />
            <input type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} placeholder="Thumbnail URL" />
            <input type="text" name="wallet_address" value={formData.wallet_address} onChange={handleChange} placeholder="Wallet Address" />
            <button type="submit">Create Post</button>
        </form>
    );
};

export default CreatePostForm;
