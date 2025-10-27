import dotenv from 'dotenv';
dotenv.config(); // must be **first**

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME); // should print Genchatgptai
export default cloudinary;
