const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
  },
});

const getImage = async (req, res) => {
  try {
    const key = req.params[0];
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command);
    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const putImage = async (req, res) => {
  try {
    const { key, contentType } = req.body;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getImage = getImage;
exports.putImage = putImage;
