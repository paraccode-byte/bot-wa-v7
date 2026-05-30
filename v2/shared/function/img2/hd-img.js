import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export default async function hdimage(buffer) {
    cloudinary.config({
        cloud_name: 'dszqwsiyt',
        api_key: '321364517488687',
        api_secret: 'TrtLPRvF6nX9no_6Ed9t9rgu9K8'
    });

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                transformation: [
                    { effect: "improve" },
                    { effect: "sharpen:100" },
                    { quality: "auto" }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error("Gagal upload:", error);
                    return reject(error);
                }
                resolve(result.secure_url); 
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
}