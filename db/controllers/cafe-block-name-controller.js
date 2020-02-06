const CafeBlockName = require("../models/cafe_block_name");

exports.getCafeBlockNames = function () {
    return new Promise((resolve, reject) => {
        CafeBlockName.findAll({ raw: true }).then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
};