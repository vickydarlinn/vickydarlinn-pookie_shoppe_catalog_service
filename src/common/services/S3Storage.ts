import createHttpError from "http-errors";
import { Config } from "../config";
import { FileData, FileStorage } from "../types";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
export class S3Storage implements FileStorage {
  private client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: Config.S3_REGION,
      credentials: {
        accessKeyId: Config.S3_ACCESS_KEY!,
        secretAccessKey: Config.S3_SECRET_KEY!
      }
    });
  }

  async upload(data: FileData): Promise<void> {
    // Convert ArrayBuffer to Uint8Array for compatibility with Body
    const bodyData =
      data.fileData instanceof ArrayBuffer
        ? new Uint8Array(data.fileData)
        : data.fileData;

    const objectParams = {
      Bucket: Config.S3_BUCKET,
      Key: data.filename,
      Body: bodyData
    };

    // Send command and ensure a void return
    await this.client.send(new PutObjectCommand(objectParams));
  }
  async delete(filename: string): Promise<void> {
    const objectParams = {
      Bucket: Config.S3_BUCKET,
      Key: filename
    };

    // Send command and ensure a void return
    await this.client.send(new DeleteObjectCommand(objectParams));
  }
  getObjectUri(filename: string): string {
    const bucket = Config.S3_BUCKET;
    const region = Config.S3_REGION;

    if (typeof bucket === "string" && typeof region === "string") {
      return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
    }
    const error = createHttpError(500, "Invalid S3 configuration");
    throw error;
  }
}
