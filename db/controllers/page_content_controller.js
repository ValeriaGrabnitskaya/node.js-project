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