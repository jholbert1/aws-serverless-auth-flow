import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { S3PutObject } from "../interfaces/S3PutObjectInterface";

export default class S3Service {
  private static instance?: S3Service;

  private s3: S3;

  private readonly S3_API_VERSION = "2012-08-10";

  private constructor() {
    this.s3 = new S3({ apiVersion: this.S3_API_VERSION });
  }

  /**
   * Returns S3Service instanciated
   *
   * @returns {S3Service}.
   */
  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }

    return S3Service.instance;
  }

  static destroyInstance(): void {
    delete this.instance;
  }

  /**
   * Get an object that is already stored in Amazon S3
   *
   * @param bucket
   * @param key
   * @returns {Promise<PromiseResult<S3.GetObjectOutput, AWSError>>}
   */
  getObject(bucket: string, key: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    return this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }

  /**
   * Creates a copy of an object that is already stored in Amazon S3
   *
   * @param bucket
   * @param copySource
   * @param key
   * @returns {Promise<PromiseResult<S3.CopyObjectOutput, AWSError>>}
   */
  copyObject(bucket: string, copySource: string, key: string): Promise<PromiseResult<S3.CopyObjectOutput, AWSError>> {
    return this.s3
      .copyObject({
        Bucket: bucket,
        CopySource: copySource,
        Key: key,
      })
      .promise();
  }

  /**
   * Remove object from S3 bucket
   *
   * @param bucket
   * @param key
   * @returns {Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>>}
   */
  deleteObject(bucket: string, key: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    return this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }

  /**
   * Adds an object to a bucket
   *
   * @param params S3PutObjectInterface
   * @returns {Promise<PromiseResult<S3.PutObjectOutput, AWSError>>}
   */
  putObject(params: S3PutObject): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    return this.s3
      .putObject({
        Bucket: params.bucket,
        Key: params.key,
        Body: params.body,
        ContentEncoding: params.contentEncoding ?? "base64",
        ContentType: params.contentType,
      })
      .promise();
  }
}
