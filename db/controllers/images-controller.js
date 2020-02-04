const Images = require("../models/images.js");

exports.getImagesById = async function (imageId) {
    return new Promise((resolve, reject) => {
        Images.findAll({ where: { id: imageId }, raw: true })
            .then(data => {
                resolve(data[0]);
            })
            .catch(err => {
                reject(err)
            });
    })
};

exports.updateImageUrlById = async function (imageId, newUrl) {
    return new Promise((resolve, reject) => {
        Images.update({ url: newUrl }, {
            where: {
                id: imageId
            }
        })
            .then((res) => {
                resolve();
            })
            .catch(err => {
                reject(err)
            });
    })
};