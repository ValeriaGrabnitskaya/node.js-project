const CoreData = require("../models/core-data.js");

exports.getCoreData = function () {
    return new Promise((resolve, reject) => {
        CoreData.findAll({ raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getUrlCodes = function () {
    return new Promise((resolve, reject) => {
        CoreData.findAll({
            attributes: ['url_code']
        }, { raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getCoreDataByUrlCode = async function (url) {
    return new Promise((resolve, reject) => {
        CoreData.findAll({ where: { url_code: url }, raw: true })
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

exports.getCoreDataByContentId = async function (content_id) {
    return new Promise((resolve, reject) => {
        CoreData.findOne({ where: { content_id: content_id }, raw: true })
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
};

exports.updateCoreDataByContentId = async function (coreData) {
    return new Promise((resolve, reject) => {
        CoreData.update({
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