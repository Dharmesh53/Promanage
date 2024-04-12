const NodeCache = require("node-cache");

const Cache = new NodeCache({ stdTTL: 10 });

module.exports = Cache;
