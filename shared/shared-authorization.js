const { sha256 } = require("js-sha256");
const sharedConfig = require('../configures/shared_config');
const crypto = require('crypto');

exports.getSoltedPassword = function (password) {
  return sha256(password) + sharedConfig.PASSWORD_END;
}

exports.generateToken = function ({ stringBase = 'base64', byteLength = 20 } = {}) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(byteLength, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString(stringBase));
      }
    });
  });
}

exports.getTodayTimestamp = function () {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = dateNow.getMonth();
  const date = dateNow.getDate();
  var utcDate = new Date(Date.UTC(2020, 0, 1, 0, 0, 0)); // 1577826000
  // console.log(new Date((utcDate / 1000) * 1000))
  return utcDate / 1000;
} 