const PageContent = require("../models/page_content.js");
const { Op } = require("sequelize");

exports.getPageContentByContentId = async function (contentId) {
    return new Promise((resolve, reject) => {
        PageContent.findAll({ where: { content_id: contentId }, raw: true })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
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

exports.getCafePageContent = async function (cafeBlockIds) {
    return new Promise((resolve, reject) => {
        PageContent.findAll(
            {
                where: {
                    cafe_block_id: {
                        [Op.or]: cafeBlockIds
                    }
                },
                order: [
                    ['content_id', 'ASC']
                ],
                attributes: ['content_id', 'block_content', 'cafe_block_id'],
                raw: true
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err)
            });
    })
};
