const { S3Client } = require("@aws-sdk/client-s3");

// console.log(
//   process.env.AWS_ACCESS_KEY_ID,
//   process.env.AWS_REGION,
//   process.env.AWS_SECRET_ACCESS_KEY
// );
const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
const s3 = new S3Client(config);

module.exports = s3;
