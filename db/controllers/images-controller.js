const Images = require("../models/images.js");

exports.getImagesById = async function (imageId) {
    return new Promise((resolve, reject) => {
        Images.findAll({ where: { id: imageId }, raw: true })
            .then(data => {
                resolve(data[0]);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    })
};