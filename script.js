const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
var cookieParser = require('cookie-parser');
const multer = require('multer');

var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);

const { addLog } = require('./logging/log');
const { getSoltedPassword, generateToken, getTodayTimestamp } = require('./shared/shared-authorization');
const { compose_maket, compose_edit_maket, compose_maket_edit_catalog } = require('./compositors/pages_compositors.js');
const coreDataController = require('./db/controllers/core-data-controller.js');
const coreCafeController = require('./db/controllers/core-cafe-controller');
const userController = require('./db/controllers/user-controller');
const sessionController = require('./db/controllers/session-controller');
const pageContentController = require('./db/controllers/page_content_controller');
const imageController = require('./db/controllers/images-controller');
const sharedMapForm = require('./shared/shared_map_form');
const sharedCoreData = require('./shared/shared_core_data');
const indexing = require('./indexing/indexing');

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

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/big");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

webserver.use(multer({ storage: storageConfig }).single("image"));

webserver.get('/', async (req, res, next) => {
    addLog(logFilePath, "обращение к / - рендерим как /authorization");
    req.url = '/authorization';
    next();
});

webserver.get('/authorization', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = authorization');
    res.sendFile(path.resolve(__dirname, './public/authorization.html'));
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
        addLog(logFilePath, error);
    }
})

webserver.use(function (req, res, next) {
    if (req.cookies.token) {
        next();
    } else {
        res.redirect('/authorization');
    }
})

webserver.get('/edit-pages', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = edit-pages');

    try {
        const coreDataList = await coreDataController.getCoreData();
        const coreCafeDataList = await coreCafeController.getCoreCafeData();
        let pageData = {
            cafes: [...coreDataList, ...coreCafeDataList],
            token: req.cookies.token
        };
        res.render('edit-pages', pageData);

    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.get('/cafe-:urlcode', async (req, res) => {
    let pageUrlCode = req.params.urlcode;
    addLog(logFilePath, 'страница, urlcode = ', pageUrlCode);
    try {
        const coreDataInfo = await coreCafeController.getCoreCafeDataByUrlCode(pageUrlCode, res);
        if (!coreDataInfo) {
            addLog(logFilePath, 'страница не найдена, urlcode = ', pageUrlCode);
            res.status(404).send('Извините, такой страницы у нас нет!');
        } else {
            let pageData = await compose_maket(
                { logFilePath },
                {
                    mainPageInfo: coreDataInfo
                }
            );
            pageData.token = req.cookies.token;
            res.render("cafe", pageData);
        }
    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.get('/:urlcode', async (req, res) => {
    let pageUrlCode = req.params.urlcode;
    addLog(logFilePath, 'страница, urlcode = ', pageUrlCode);
    try {
        const coreDataInfo = await coreDataController.getCoreDataByUrlCode(pageUrlCode, res);
        if (!coreDataInfo) {
            addLog(logFilePath, 'индивидуальная страница не найдена, urlcode = ', pageUrlCode);
            res.status(404).send('Извините, такой страницы у нас нет!');
        } else {
            let pageData = await compose_maket(
                { logFilePath },
                {
                    mainPageInfo: coreDataInfo
                }
            );
            pageData.token = req.cookies.token;
            res.render(pageUrlCode, pageData);
        }
    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.get('/get-edit-page-data/:contentId', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = get-edit-page-data');
    try {
        const editBlock = await compose_edit_maket(
            { logFilePath },
            { content_id: req.params.contentId }
        )
        res.send(editBlock);
    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.post('/save-page', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = save-page');
    try {
        const mapData = await sharedMapForm.mapSaveEditPage(req.body);
        if (mapData.coreData) {
            await sharedCoreData.updateCoreDataByContentId(mapData.coreData)
        }
        if (mapData.coreData && mapData.pageData) {
            for (var key in mapData.pageData) {
                const pageItem = {
                    block_content: mapData.pageData[key]
                }
                await pageContentController.updatePageDataByContentIdAndId(mapData.coreData.content_id, key, pageItem);
            }
        }
        if (req.file) {
            await imageController.updateImageUrlById(req.body.imageId, req.file.originalname);
        }
        await indexing.indexingPages(req.cookies.token);
        res.redirect('/edit-pages');
    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.post('/save-image', async (req, res) => {
    addLog(logFilePath, 'страница, urlcode = save-image');

    try {
        if (req.file) {
            await imageController.updateImageUrlById(req.body.imageId, req.file.originalname);
        }
        res.sendStatus(200);
    } catch (error) {
        addLog(logFilePath, error);
    }
});

webserver.listen(port, () => {
    addLog(logFilePath, "web server running on port " + port);
});