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

exports.getSearchWords = async function (wordArray) {
    return new Promise((resolve, reject) => {
        IndexUrlsWords.findAll({
            where: {
                word: wordArray,
            },
            attributes: ['index_url', 'clean_txt_index', 'word'],
            order: ['index_url', 'clean_txt_index'],
            raw: true
        })
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
};