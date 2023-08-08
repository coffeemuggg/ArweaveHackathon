import React, { useState } from 'react';

const DeletePage: React.FC = () => {
  const [id, setId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/deletePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Delete Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Post ID:</label>
            <input
              type="text"
              value={id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Delete Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeletePage;
