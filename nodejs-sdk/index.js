import 'dotenv/config'

// This is used for getting user input.
// import { createInterface } from "readline/promises";
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectsCommand,
  GetBucketAclCommand
} from "@aws-sdk/client-s3";

// A region and credentials can be declared explicitly. For example
// `new S3Client({ region: 'us-east-1', credentials: {...} })` would
//initialize the client with those settings. However, the SDK will
// use your local configuration and credentials if those properties
// are not defined here.
const s3Client = new S3Client({
  credentials: fromEnv()
});

async function main() {
  const listBucketsCommand = new ListBucketsCommand({});
  // List all Amazon S3 bucket. The epoch timestamp is appended
  const resListAllBucket = await s3Client.send(listBucketsCommand);

  console.log(resListAllBucket);
  return;

  // Create an Amazon S3 bucket. The epoch timestamp is appended
  // to the name to make it unique.
  const bucketName = `test-bucket-${Date.now()}`;
  const resCreateBucket = await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );

  console.log(resCreateBucket);



  // // Read the object.
  // const { Body } = await s3Client.send(
  //   new GetObjectCommand({
  //     Bucket: bucketName,
  //     Key: "my-first-object.txt",
  //   })
  // );

  // console.log(await Body.transformToString());

  // // Confirm resource deletion.
  // const prompt = createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // const result = await prompt.question("Empty and delete bucket? (y/n) ");
  // prompt.close();

  // if (result === "y") {
  //   // Create an async iterator over lists of objects in a bucket.
  //   const paginator = paginateListObjectsV2(
  //     { client: s3Client },
  //     { Bucket: bucketName }
  //   );
  //   for await (const page of paginator) {
  //     const objects = page.Contents;
  //     if (objects) {
  //       // For every object in each page, delete it.
  //       for (const object of objects) {
  //         await s3Client.send(
  //           new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
  //         );
  //       }
  //     }
  //   }

  //   // Once all the objects are gone, the bucket can be deleted.
  //   await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  // }
}

const putObject = async () => {
  // // Put an object into an Amazon S3 bucket.
  const response = await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: "my-first-object.txt",
      Body: "Hello JavaScript SDK!",
    })
  );
  console.log(response);
};

const helloS3 = async () => {
  const command = new ListBucketsCommand({});

  const { Buckets } = await s3Client.send(command);
  console.log("Buckets: ");
  console.log(Buckets.map((bucket) => bucket.Name).join("\n"));
  return Buckets;
};

const listObjects = async () => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET,
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 5,
  });

  const res = await s3Client.send(command);
  console.log(res);
}

const deleteBucket = async () => {
  const command = new DeleteBucketCommand({
    Bucket: "test-bucket-1713099568769",
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

const deleteObject = async () => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: "2024-04-14-12-12-33-6851129BD308AC69",
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

const deleteObjects = async () => {
  const command = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET,
    Delete: {
      Objects: [{ Key: "2024-04-14-12-21-18-96A087587FD77C6B" }, { Key: "object2.txt" }],
    },
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);

    if (response.Deleted) {
      console.log(
        `Successfully deleted ${response.Deleted.length} objects from S3 bucket. Deleted objects:`,
      );
    }
  } catch (err) {
    console.error(err);
  }
};


const getBucketAcl = async () => {
  const command = new GetBucketAclCommand({
    Bucket: process.env.S3_BUCKET,
  });

  try {
    const response = await s3Client.send(command);
    const Grants = response.Grants;
    console.log(Grants, response);
  } catch (err) {
    console.error(err);
  }
};

// Call a function if this file was run directly. This allows the file
// to be runnable without running on import.
import { fileURLToPath } from "url";
import { exit } from "process";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // main();
  // helloS3();
  // listObjects();
  // deleteBucket();
  // deleteObject();
  // deleteObjects();
  // getBucketAcl();
  putObject();
}
