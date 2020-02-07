const IndexUrls = require("../models/index_urls");

exports.updateActualFlags = async function () {
    return new Promise((resolve, reject) => {
        IndexUrls.update({ actual_flag: 0 }, { where: {} })
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};

exports.deleteUrlsWithZeroActualFlags = async function () {
    return new Promise((resolve, reject) => {
        IndexUrls.destroy({ where: { actual_flag: 0 } })
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};

exports.getHtmlCrcByUrl = async function (url) {
    return new Promise((resolve, reject) => {
        IndexUrls.findAll({
            where: { url: url },
            attributes: ['id', 'html_crc'],
            raw: true
        })
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
};

// url,         title, group_code,        group_params,                        html_crc,  add_dt,  actual_flag,   last_render_dt,   last_modification_dt
// urlInfo.url, title, urlInfo.groupCode, JSON.stringify(urlInfo.groupParams), htmlCRC    now            1         now               now

exports.addIndexData = async function (indexData) {
    return new Promise((resolve, reject) => {
        IndexUrls.create({
            url: indexData.url,
            title: indexData.title,
            group_code: indexData.groupCode,
            group_params: JSON.stringify(indexData.groupParams),
            html_crc: indexData.html_crc,
            add_dt: new Date(),
            actual_flag: 1,
            last_render_dt: new Date(),
            last_modification_dt: new Date()
        })
            .then(data => {
                resolve(data.id);
            })
            .catch(err => reject(err));
    })
};

exports.updateActualPages = async function (indexUrlId) {
    return new Promise((resolve, reject) => {
        IndexUrls.update(
            {
                actual_flag: 1,
                last_render_dt: new Date()
            }, { where: { id: indexUrlId }, raw: true }
        )
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};

exports.updateReindexingPage = async function (updateData) {
    return new Promise((resolve, reject) => {
        IndexUrls.update(
            {
                title: updateData.title,
                html_crc: updateData.html_crc,
                last_modification_dt: new Date()
            }, { where: { id: updateData.id }, raw: true }
        )
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            });
    })
};
