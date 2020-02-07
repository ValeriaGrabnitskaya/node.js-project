const IndexUrlsWords = require("../models/index_urls_words");

exports.deleteIndexUrlWords = async function (indexUrlId) {
    return new Promise((resolve, reject) => {
        IndexUrlsWords.destroy({ where: { index_url: indexUrlId } })
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};

exports.addIndexUrlWords = async function (updateDataArray) {
    return new Promise((resolve, reject) => {
        IndexUrlsWords.bulkCreate(updateDataArray)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};