import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      throw new Error('No file provided');
    }

    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'speedlot',
    });

    return new Response(JSON.stringify({ url: uploadResponse.secure_url }), { status: 200 });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500 });
  }
}
