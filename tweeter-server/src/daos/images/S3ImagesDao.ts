import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { ImagesDao } from "./ImagesDao";

export class S3ImagesDao implements ImagesDao {
    readonly bucketName = "cs340-tweeter-backend"
    readonly region = "us-east-1"

    public async putImage(fileName: string, encodedImage: string): Promise<string> {
        const base64Data = encodedImage.includes(",")
            ? encodedImage.split(",")[1]
            : encodedImage;
        
        const decodedBuffer = Buffer.from(base64Data, "base64");
       
        const fileInfo = await fileTypeFromBuffer(new Uint8Array(decodedBuffer));

        if (!fileInfo) {
            throw new Error("Bad Request: unable to detect profile image file type");
        }

        const { ext, mime } = fileInfo;

        const s3Params = {
            Bucket: this.bucketName,
            Key: `image/${fileName}.${ext}`,
            Body: decodedBuffer,
            ContentType: mime,
            ACL: ObjectCannedACL.public_read,
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
}
