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
        const urlCode = req.params.urlCode;
        User.findAll({ where: { urlCode: urlCode }, raw: true })
            .then(data => {
                resolve(data[0]);
            })
            .catch(err => reject(err));
    })
};