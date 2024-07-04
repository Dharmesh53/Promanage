const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Project = require("../models/project");

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECERT_ACCESS_KEY,
  },
});

const getFile = async (req, res) => {
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

const putFile = async (req, res) => {
  try {
    const { key, contentType } = req.body;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return res.status(200).json({ url });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message, yo: "that's messed up!!" });
  }
};

const deleteFile = async (req, res) => {
  try {
    let Objectkey = req.params[0];

    if (typeof Objectkey !== "string") {
      throw new Error("Invalid key");
    }

    const segments = Objectkey.split("/");
    const documentId = segments[1];
    const filePath = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${Objectkey}`;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Objectkey,
    });

    await s3Client.send(command);

    await Project.updateOne(
      { _id: documentId },
      { $pull: { files: filePath } },
    );

    return res.status(200).json({ msg: "file deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getFile = getFile;
exports.putFile = putFile;
exports.deleteFile = deleteFile;
