async function compose_maket_main_page(coreData,appData) {

    

    // let html = "";

    // html += `<html lang="ru">\n`;
    // html += `<head>\n`;
    // if (appData.indPageInfo.metakeywords)
    //     html += `<meta name="keywords" content="${appData.indPageInfo.metakeywords}"/>\n`;
    // if (appData.indPageInfo.metadescription)
    //     html += `<meta name="description" content="${appData.indPageInfo.metadescription}"/>\n`;
    // html += `<title>${appData.indPageInfo.title} - ${appData.options.SITENAME.str_value}</title>\n`;
    // html += `</head>\n`;

    // // скомпонуем HTML-код для каждой визуальной части сайта, построив соответствующий контент
    // let headContentHTMLs = await composeContent(22, coreData, appData); // в макете индивидуальной страницы в шапке - пусть будет всё тот же контент 22
    // let bottomContentHTMLs = await composeContent(33, coreData, appData); // в макете индивидуальной страницы в подвале - пусть будет всё тот же контент 33
    // let urlIndPageContentHTMLs = await composeContent(55, coreData, appData); // в макете индивидуальной страницы в "содержимом страницы из УРЛа" - всегда контент 55

    // html += `<table border=1 cellpadding=5 style='width: 100%; border-collapse: collapse'>\n`;
    // html += `<tr><td><i>ШАПКА</i><br>${headContentHTMLs.join("\n")}</td></tr>\n`;
    // html += `<tr>\n`;
    // html += `<td><i>СОДЕРЖИМОЕ СТРАНИЦЫ ИЗ УРЛА</i><br>${urlIndPageContentHTMLs.join("\n")}</td>\n`;
    // html += `</tr>\n`;
    // html += `<tr><td><i>ПОДВАЛ</i><br>${bottomContentHTMLs.join("\n")}</td></tr>\n`;
    // html += `</table>\n`;

    // html += `</html>\n`;

    // return html;
}

module.exports={
    compose_maket_main_page
}