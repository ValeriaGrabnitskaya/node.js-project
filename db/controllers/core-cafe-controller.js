const CoreCafeData = require("../models/core-cafe-data");

exports.getCoreCafeData = function () {
    return new Promise((resolve, reject) => {
        CoreCafeData.findAll({ raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getUrlCodes = function () {
    return new Promise((resolve, reject) => {
        CoreCafeData.findAll({
            attributes: ['url_code'],
        }, { raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getCoreCafeDataByUrlCode = async function (url) {
    return new Promise((resolve, reject) => {
        CoreCafeData.findAll({ where: { url_code: url }, raw: true })
            .then(data => {
                if (data.length === 1) {
                    resolve(data[0]);
                } else {
                    reject(404);
                }
            })
            .catch(err => reject(err));
    })
};

exports.getCoreCafeDataByContentId = async function (content_id) {
    return new Promise((resolve, reject) => {
        CoreCafeData.findOne({ where: { content_id: content_id }, raw: true })
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
};

exports.updateCoreCafeDataByContentId = async function (coreData) {
    return new Promise((resolve, reject) => {
        CoreCafeData.update(
            {
                title: coreData.title,
                metakeywords: coreData.metakeywords,
                metadescription: coreData.metadescription,
            }, { where: { content_id: coreData.content_id }, raw: true })
            .then(() => {
                resolve();
            })
            .catch(err => reject(err));
    })
};