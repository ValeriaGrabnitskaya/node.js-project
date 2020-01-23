const express = require('express');
const path = require('path');
const hbs = require("hbs");

const { addLog } = require('./logging/log');
const { compose_maket_main_page } = require('./pages_compositors/pages_compositors.js');
const coreDataController = require('./db/controllers/core-data-controller.js');

const webserver = express();
const port = 7480;
const logFilePath = path.join(__dirname, '/logging/_server.log');

webserver.set("view engine", "hbs");

webserver.set('views', path.join(__dirname, 'public'));

hbs.registerPartials(__dirname + "/public/components");

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/', async (req, res, next) => {
    addLog(logFilePath, "обращение к / - рендерим как /main");
    req.url = '/main-page';
    next();
});

webserver.get('/:urlcode', async (req, res) => {
    res.sendFile(path.resolve(__dirname,'./public/catalog.html'));
    // let pageUrl = req.params.urlcode;
    // addLog(logFilePath, 'страница, urlcode = ' + pageUrl);

    // try {
    //     const coreDataInfo = await coreDataController.getCoreDataByUrlCode(req, res);
    //     if (!coreDataInfo) {
    //         addLog(logFilePath, "индивидуальная страница не найдена, urlcode =" + pageUrl);
    //         res.status(404).send("Извините, такой страницы у нас нет!");
    //     } else {
    //         let mainPageData = await compose_maket_main_page(
    //             { logFilePath },
    //             {
    //                 mainPageInfo: coreDataInfo
    //             }
    //         );
    //         if (pageUrl === 'main-page') {
    //             res.render("index.hbs", mainPageData);
    //         } else {
    //             // res.render("catalog.hbs", mainPageData);
    //             res.sendFile('catalog.html');
    //         }
    //     }

    // } catch (error) {
    //     console.log(error);
    // }
});

// // УРЛы вида /xxx
// webserver.get('/:urlcode', async (req, res) => {
//     let pageUrlCode = req.params.urlcode;
//     logLine(logFilePath, 'вид страницы: индивидуальная, urlcode=' + pageUrlCode);

//     // если мы хотим запретить прямое обращение к /main из браузера - можно тут сравнить req.url и req.originalUrl

//     let connection = null;
//     try {
//         connection = await newConnectionFactory(pool, res);

//         let indPages = await selectQueryFactory(connection, `
//             select title, content, metakeywords, metadescription
//             from indpages
//             where url_code=?
//         ;`, [pageUrlCode]);

//         if (indPages.length !== 1) {
//             logLine(logFilePath, "индивидуальная страница не найдена, urlcode=" + pageUrlCode);
//             res.status(404).send("Извините, такой страницы у нас нет!");
//         }
//         else {

//             // некоторым блокам потребуется содержимое таблицы настроек
//             // let optionsArr = await selectQueryFactory(connection, `select * from options;`, []);
//             // let options = arrayToHash(optionsArr, 'code');

//             // все новости рендерим по "макету индивидуальной страницы", но можно для разных индивидуальных страниц использовать разные макеты
//             let html = await compose_maket_main_page( // вызываем построение макета индивидуальной страницы
//                 { connection, logFilePath },
//                 { // данные приложения
//                     indPageInfo: indPages[0], // информация о индивидуальной странице
//                     options, // настройки сайта
//                 }
//             );
//             res.send(html);
//         }
//     }
//     catch (error) {
//         reportServerError(error.stack, res, logFilePath);
//     }
//     finally {
//         if (connection)
//             connection.release();
//     }

// });

// app.use("/users", userRouter);
// // УРЛы вида /new/xxx
// webserver.get('/new/:urlcode', async (req, res) => {
//     let newUrlCode = req.params.urlcode;
//     logLine(logFilePath, 'вид страницы: новость, urlcode=' + newUrlCode);

//     let connection = null;
//     try {
//         connection = await newConnectionFactory(pool, res);

//         let news = await selectQueryFactory(connection, `
//             select header, content, metakeywords, metadescription
//             from news
//             where url_code=?
//         ;`, [newUrlCode]);

//         if (news.length !== 1) {
//             logLine(logFilePath, "новость не найдена, urlcode=" + newUrlCode);
//             res.status(404).send("Извините, такой новости у нас нет!");
//         }
//         else {

//             // некоторым блокам потребуется содержимое таблицы настроек
//             let optionsArr = await selectQueryFactory(connection, `select * from options;`, []);
//             let options = arrayToHash(optionsArr, 'code');

//             // все новости рендерим по "макету одной новости", но можно для разных новостей использовать разные макеты
//             let html = await composeMaket_New( // вызываем построение макета одной новости
//                 { // служебные параметры
//                     connection, // соединение с БД - мы полагаем, что макету потребуется делать свои операции с БД
//                     logFilePath, // имя файла лога - мы полагаем, что макету потребуется что-то записать в лог
//                 },
//                 { // данные приложения
//                     newInfo: news[0], // информация о новости из УРЛа - мы полагаем, что в макете будет блок "новость из УРЛа" и ему нужна эта информация
//                     options, // настройки сайта
//                 }
//             );
//             res.send(html);
//         }
//     }
//     catch (error) {
//         reportServerError(error.stack, res, logFilePath);
//     }
//     finally {
//         if (connection)
//             connection.release();
//     }

// });

webserver.listen(port, () => {
    addLog(logFilePath, "web server running on port " + port);
});