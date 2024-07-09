const { deleteFile } = require("../controllers/awsController");

const deleteFileWrapper = async (objectKey) => {
  return new Promise((resolve, reject) => {
    const req = {
      params: [objectKey],
    };
    const res = {
      status: (statusCode) => ({
        json: (data) => {
          if (statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(data.msg));
          }
        },
      }),
    };
    deleteFile(req, res);
  });
};

module.exports = { deleteFileWrapper };
