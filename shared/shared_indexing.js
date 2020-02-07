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

let dividerRES = "[ \n\r]";
let tagNameRES = "[a-zA-Z0-9]+";
let attrNameRES = "[a-zA-Z]+";
let attrValueRES = "(?:\".+?\"|'.+?'|[^ >]+)";
let attrRES = "(" + attrNameRES + ")(?:" + dividerRES + "*=" + dividerRES + "*(" + attrValueRES + "))?";
let openingTagRES = "<(" + tagNameRES + ")((?:" + dividerRES + "+" + attrRES + ")*)" + dividerRES + "*/?>"; // включает и самозакрытый вариант
let closingTagRES = "</(" + tagNameRES + ")" + dividerRES + "*>";

let openingTagRE = new RegExp(openingTagRES, "g");
let closingTagRE = new RegExp(closingTagRES, "g");

// удаляет из строки все теги
function removeTags(str, replaceStr = "") {
    if (typeof (str) == "string" && str.indexOf("<") != -1) {
        str = str.replace(openingTagRE, replaceStr);
        str = str.replace(closingTagRE, replaceStr);
    }
    return str;
}


module.exports = {
    getUrls,
    removeTags
};