const CoreData = require("../models/core-data.js");

exports.getCoreData = function () {
    return new Promise((resolve, reject) => {
        console.log("Список страниц");
        CoreData.findAll({ raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getCoreDataByUrlCode = async function (url) {
    return new Promise((resolve, reject) => {
        CoreData.findAll({ where: { url_code: url }, raw: true })
            .then(data => {
                if(data.length === 1 ) {
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
        CoreData.findAll({ where: { content_id: content_id }, raw: true })
            .then(data => {
                if(data.length === 1 ) {
                    resolve(data[0]);
                } else {
                    reject(404);
                }
            })
            .catch(err => reject(err));
    })
};

exports.updateCoreDataByContentId = async function (content_id, updateData) {
    return new Promise((resolve, reject) => {
        CoreData.update(
            { 
                metakeywords: updateData.metakeywords,  
                metadescription: updateData.metadescription,  
                title: updateData.title,  
            }, { where: { content_id: content_id }, raw: true })
            .then(data => {
               resolve();
            })
            .catch(err => reject(err));
    })
};