const coreDataController = require('../db/controllers/core-data-controller.js');
const coreCafeController = require('../db/controllers/core-cafe-controller');

// возвращает массив со всеми УРЛами (страницами) сайта
async function getUrls() {

    let urls = [];

    let corePages = await coreDataController.getUrlCodes();
    corePages.forEach(page => {
        urls.push({
            url: `/${page.url_code}`,
            groupCode: 'core_pages',
            groupParams: { corePagesURLCode: page.url_code },
        });
    });

    let cafes = await coreCafeController.getUrlCodes();
    cafes.forEach(cafe => {
        urls.push({
            url: `/cafe-${cafe.url_code}`,
            groupCode: 'cafe',
            groupParams: { cafeURLCode: cafe.url_code },
        });
    });

    return urls;
}

// удаляет из строки все теги
function removeTags(str, replaceStr = "") {
    if (typeof (str) == "string" && str.indexOf("<") != -1) {
        str = str.replace(/<\/?[^>]+>/g, ' ');
    }
    return str;
}


module.exports = {
    getUrls,
    removeTags
};