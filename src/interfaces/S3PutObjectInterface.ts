export interface S3PutObject {
    bucket: string;
    key: string;
    body: Buffer;
    contentEncoding?: string;
    contentType?: string;
  }
  