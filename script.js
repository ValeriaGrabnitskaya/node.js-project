const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
var cookieParser = require('cookie-parser');

var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);


const { addLog } = require('./logging/log');
const { getSoltedPassword, generateToken, getTodayTimestamp } = require('./shared/shared-authorization');
const { compose_maket_main_page, compose_maket_catalog } = require('./pages_compositors/pages_compositors.js');
const coreDataController = require('./db/controllers/core-data-controller.js');
const userController = require('./db/controllers/user-controller');
const sessionController = require('./db/controllers/session-controller');

const webserver = express();
const port = 7480;
const logFilePath = path.join(__dirname, '/logging/_server.log');

webserver.use(bodyParser.json());
webserver.use(cookieParser());

webserver.use(session({
    secret: 'ANY_SECRET_TEXT', // используется для подписи сессионного кука, может быть любым текстом
    resave: false,
    saveUninitialized: true
}));

// webserver.use(function (req, res, next) {

//     // req.session - это данные сессии, т.е. данные ЭТОГО посетителя
//     if (!req.session.views) {
//         req.session.views = {}; 
//         // здесь будем хранить информацию, какая страница сколько раз просмотрена ЭТИМ посетителем
//         // ключ - УРЛ страницы, значение - количество просмотров этой страницы ЭТИМ посетителем
//     }

//     // счётчик просмотров этой страницы этим посетителем увеличиваем на 1
//     req.session.views[req.originalUrl] = (req.session.views[req.originalUrl] || 0) + 1; 

//     next();
// });


// устанавливаем настройки для файлов layout
webserver.engine("hbs", expressHbs(
    {
        layoutsDir: "public/layouts",
        defaultLayout: "base",
        extname: "hbs"
    }
))

webserver.set("view engine", "hbs");

webserver.set('views', path.join(__dirname, 'public'));

hbs.registerPartials(__dirname + "/public/components");

webserver.use(
    express.static(path.resolve(__dirname, "public"))
);

webserver.get('/', async (req, res, next) => {
    addLog(logFilePath, "обращение к / - рендерим как /authorization");
    req.url = '/authorization';
    next();
});

webserver.get('/authorization', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = authorization');
    res.sendFile(path.resolve(__dirname,'./public/authorization.html'));
})

webserver.post('/check-authorization', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = check-authorization');
    try {
        const user = await userController.getUserByLoginPassword(req.body.login, getSoltedPassword(req.body.password));
        if (!user) {
            res.sendStatus(401);
        } else {
            let token = await generateToken();
            if (token) {
                const session = {
                    login: user.login,
                    token: token,
                    last_session_date: getTodayTimestamp()
                };
                await sessionController.setSession(session);
                res.send(JSON.stringify({ token: token }));
            }
        }
    } catch (error) {
        console.log(error);
    }
})

webserver.use(function (req, res, next) {
    if (req.cookies.token) {
        next();
    } else {
        res.redirect('/authorization');
    }
})

webserver.get('/main-page', async (req, res) => {
    // res.sendFile(path.resolve(__dirname,'./public/catalog.html'));
    addLog(logFilePath, 'страница, urlcode = main-page');
    try {
        const coreDataInfo = await coreDataController.getCoreDataByUrlCode('main-page', res);
        if (!coreDataInfo) {
            addLog(logFilePath, "индивидуальная страница не найдена, urlcode = main-page");
            res.status(404).send("Извините, такой страницы у нас нет!");
        } else {
            let mainPageData = await compose_maket_main_page(
                { logFilePath },
                {
                    mainPageInfo: coreDataInfo
                }
            );
            mainPageData.token = req.cookies.token;
            console.log(mainPageData)
            res.render("main-page", mainPageData);
        }
    } catch (error) {
        console.log(error);
    }
});

webserver.get('/catalog', async (req, res) => {
    // res.sendFile(path.resolve(__dirname,'./public/catalog.html'));
    addLog(logFilePath, 'страница, urlcode = catalog');

    try {
        const coreDataInfo = await coreDataController.getCoreDataByUrlCode('catalog', res);
        if (!coreDataInfo) {
            addLog(logFilePath, "индивидуальная страница не найдена, urlcode = catalog");
            res.status(404).send("Извините, такой страницы у нас нет!");
        } else {
            let mainPageData = await compose_maket_catalog(
                { logFilePath },
                {
                    mainPageInfo: coreDataInfo
                }
            );
            res.render("catalog", mainPageData);
        }

    } catch (error) {
        console.log(error);
    }
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