const PageContent = require("../models/page_content.js");

exports.getPageContentByContentId = async function (contentId) {
    return new Promise((resolve, reject) => {
        PageContent.findAll({ where: { content_id: contentId }, raw: true })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    })
};

exports.updatePageDataByContentIdAndId = async function (content_id, id, updateData) {
    return new Promise((resolve, reject) => {
        PageContent.update(updateData, { where: { content_id: content_id, id: id }, raw: true })
            .then(() => {
               resolve();
            })
            .catch(err => reject(err));
    })
};