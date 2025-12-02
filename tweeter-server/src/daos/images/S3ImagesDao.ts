import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { ImagesDao } from "./ImagesDao";

export class S3ImagesDao implements ImagesDao {
    readonly bucketName = "cs340-tweeter-backend"
    readonly region = "us-east-1"

    public async putImage(fileName: string, encodedImage: string): Promise<string> {
        const base64Data = encodedImage.includes(",")
            ? encodedImage.split(",")[1]
            : encodedImage;
        
        const decodedBuffer = Buffer.from(base64Data, "base64");
       
        const fileInfo = this.detectImageType(new Uint8Array(decodedBuffer));

        if (!fileInfo) {
            throw new Error("Bad Request: unable to detect profile image file type");
        }

        const { ext, mime } = fileInfo;

        const s3Params = {
            Bucket: this.bucketName,
            Key: `image/${fileName}.${ext}`,
            Body: decodedBuffer,
            ContentType: mime
        };

        const command = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: this.region });

        try {
            await client.send(command);
            return (`https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}.${ext}`);
        } catch (error) {
            throw Error("Bad Request: failed to save profile image with: " + error);
        }
    }

    private detectImageType(buffer: Uint8Array) {
        if (!buffer || buffer.length < 12) return null;

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (
            buffer[0] === 0x89 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x4e &&
            buffer[3] === 0x47
        ) {
            return { ext: "png", mime: "image/png" };
        }

        // JPEG: FF D8 FF
        if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
            return { ext: "jpg", mime: "image/jpeg" };
        }

        // GIF: 47 49 46 38
        if (
            buffer[0] === 0x47 &&
            buffer[1] === 0x49 &&
            buffer[2] === 0x46 &&
            buffer[3] === 0x38
        ) {
            return { ext: "gif", mime: "image/gif" };
        }

        // WebP: "RIFF"...."WEBP"
        if (
            buffer[0] === 0x52 &&
            buffer[1] === 0x49 &&
            buffer[2] === 0x46 &&
            buffer[3] === 0x46 &&
            buffer[8] === 0x57 &&
            buffer[9] === 0x45 &&
            buffer[10] === 0x42 &&
            buffer[11] === 0x50
        ) {
            return { ext: "webp", mime: "image/webp" };
        }

        return null;
    }

}
