const { sha256 } = require("js-sha256");
const fetch = require("isomorphic-fetch");

const sharedConfig = require('../configures/shared_config');
const sharedIndexing = require('../shared/shared_indexing');
const indexUrlsController = require('../db/controllers/index_urls_controller');
const indexUrlsWordsController = require('../db/controllers/index_urls_words_controller');

const token = null;

async function indexingPages(token) {
    let urls = await sharedIndexing.getUrls();
    token = token;
    // для полной переиндексации
    //await modifyQueryFactory(connection, `delete from index_urls_words;`);
    //await modifyQueryFactory(connection, `delete from index_urls;`);

    await indexUrlsController.updateActualFlags();

    console.log("обрабатываем УРЛы:");
    for (var u = 0; u < urls.length; u++) {
        const urlInfo = urls[u];
        console.log(urlInfo.url);
        await processURL(urlInfo);
    }

    await indexUrlsController.deleteUrlsWithZeroActualFlags();
}

async function processURL(urlInfo) {

    // обращаемся к серверу 6530 (полагаем что он запущен) по указанному УРЛу GET-запросом, читаем HTML-код страницы, как читает его браузер
    const fetchOptions = {
        method: "get",
        headers: {
            'Accept': "text/html",
            'Cookie': `token=${token}`
        }
    }
    const response = await fetch('http://localhost:7480' + urlInfo.url, fetchOptions);
    const html = await response.text();
    // более качественный подход - каждый блочок умеет возвращать и HTML-код для браузера+поисковиков, и текстовое представление для внутреннего поиска
    // и например блочок "заголовок" вернёт всё как сейчас, а блочок "баннер" не вернёт ничего, а блочок "прогноз погоды" вернёт слова "прогноз неделя Минск"
    // и мы здесь могли бы вместо fetch вызвать построение всей страницы с некой опцией, заставляющей блочки возвращать именно такое текстовое представление

    // получаем контрольную сумму HTML-кода (сырого содержимого УРЛа)
    // можно любым алгоритмом, который даёт хотя бы 64-битный CRC (32 бита точно мало, велика вероятность коллизий)
    const htmlCRC = sha256(html);

    // получаем содержимое тега title
    const titleRes = /<title>(.+)<\/title>/.exec(html);
    const title = titleRes ? titleRes[1] : "";

    // в таблице index_urls проверяем, есть ли такой УРЛ
    let indexUrls = await indexUrlsController.getHtmlCrcByUrl(urlInfo.url);
    // let indexUrls = await selectQueryFactory(connection, `select id, html_crc from index_urls where url=?;`, [urlInfo.url]);
    if (indexUrls.length === 0) {
        // такого УРЛа раньше не было - добавляем...

        const indexUrlId = await indexUrlsController.addIndexData({ ...urlInfo, title: title, html_crc: htmlCRC });
        console.log(indexUrlId)
        // await modifyQueryFactory(connection, `
        //     insert into index_urls(url,title,group_code,group_params,html_crc,add_dt,actual_flag,last_render_dt,last_modification_dt) 
        //     values (?,?,?,?,?,now(),1,now(),now())
        // ;`, [urlInfo.url, title, urlInfo.groupCode, JSON.stringify(urlInfo.groupParams), htmlCRC]);

        // const indexUrlId = await getLastInsertedId(connection);
        // и индексируем содержимое
        await indexURLContent(indexUrlId, html);
    }
    else {
        // такой УРЛ есть, полагаем что ровно один, по логике больше не будет (но можно проверить что indexUrls.length===1, иначе ошибка)
        const indexUrlId = indexUrls[0].id;

        // проставляем, что он актуальный и его дату-время последнего рендера
        await indexUrlsController.updateActualPages(indexUrlId);
        // await modifyQueryFactory(connection, `update index_urls set actual_flag=1, last_render_dt=now() where id=?;`, [indexUrlId]);

        // проверяем, изменилось ли содержимое этого УРЛа (если содержимое изменилось - CRC тоже изменилось)
        if (indexUrls[0].html_crc !== htmlCRC) {
            // содержимое изменилось! надо переиндексировать
            await indexURLContent(indexUrlId, html);
            await indexUrlsController.updateReindexingPage({ title: title, html_crc: htmlCRC, id: indexUrlId });
            // await modifyQueryFactory(connection, `update index_urls set title=?, html_crc=?, last_modification_dt=now() where id=?;`, [title, htmlCRC, indexUrlId]);
        }

    }
}

async function indexURLContent(indexUrlId, html) {

    // удаляем все теги, заменяем на пробелы, чтобы не склеились тексты из соседних тегов
    // (полагаем, что выделений тегами прямо посреди слов не бывает)
    // ещё лучше было бы открытие/закрытие блочных тегов заменить на \n, а строчных - на пробел, получилось бы лучше форматировать результаты поиска
    let text = sharedIndexing.removeTags(html, " ");
    console.log(text)
    // удаляем все старые слова по этому УРЛу из таблицы
    await indexUrlsWordsController.deleteIndexUrlWords(indexUrlId);
    // await modifyQueryFactory(connection, `delete from index_urls_words where index_url=?;`, [indexUrlId]);

    // добавляем все новые слова по этому УРЛу
    // можно сделать много SQL-запросов insert, но это очень неэффективно
    // скомпонуем один запрос в формате insert into таблица(поля) values (значения), (значения), (значения);
    // let valuesTexts = [];
    // let valuesDatas = [];

    let updateDataArray = [];

    while (true) {
        let searchRes = sharedConfig.WORD_RE.exec(text);
        if (!searchRes)
            break;
        console.log(searchRes[0], searchRes.index);

        let updateDataObject = {
            index_url: indexUrlId,
            clean_txt_index: searchRes.index,
            word: searchRes[0].toUpperCase()
        };

        updateDataArray.push(updateDataObject)

        // valuesTexts.push(`(${indexUrlId},${searchRes.index},?)`);
        // valuesDatas.push(searchRes[0].toUpperCase());
    }
    if (updateDataArray.length) {
        await indexUrlsWordsController.addIndexUrlWords(updateDataArray);
        // await modifyQueryFactory(connection, `insert into index_urls_words(index_url,clean_txt_index,word) values ${valuesTexts.join(", ")};`, valuesDatas);
    }
}

module.exports = {
    indexingPages
}
