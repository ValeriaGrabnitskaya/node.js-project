const CoreData = require("../models/core-data.js");

exports.getCoreData = function () {
    return new Promise((resolve, reject) => {
        console.log("Список страниц");
        CoreData.findAll({ raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};

exports.getCoreDataByUrlCode = async function (req, res) {
    return new Promise((resolve, reject) => {
        const urlCode = req.params.urlcode;
        CoreData.findAll({ where: { url_code: urlCode }, raw: true })
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