import { v2 as cloudinary } from 'cloudinary'


import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from './env'

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
})

// const toDataUrl = (file: Express.Multer.File) => {
//     const b64 = Buffer.from(file.buffer).toString("base64")
//     const dataUrl = `data:${file.mimetype};base64, ${b64}`
//     return dataUrl
// }

const getPublicIdFromFileUrl = (fileUrl: string) => {
    const fileNameUsingSubstring = fileUrl.substring(fileUrl.lastIndexOf("/")+1)
    const publicId = fileNameUsingSubstring.substring(0, fileNameUsingSubstring.lastIndexOf('.'))
    return publicId
}

export default {
    async uploadSingle(file: Express.Multer.File) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )

            stream.end(file.buffer)
        })
    },
    async uploadMultiple(files: Express.Multer.File[]) {
        const uploadBatch = files.map((item) => {

            const result = this.uploadSingle(item)
            return result
        })
        const results = await Promise.all(uploadBatch)
        return results
    },
    async remove(fileUrl: string) {
        const publicId = getPublicIdFromFileUrl(fileUrl)
        const result = await cloudinary.uploader.destroy(publicId)
        return result;
    }
};