const pageContentController = require('../db/controllers/page_content_controller.js');
const imagesController = require('../db/controllers/images-controller.js');
const blockCompositor = require('./block_compositor.js');
const Blocks = require('../constants/blocks.js');
const { addLog } = require('../logging/log.js');
const { composeEditImage, composeEditCoreData } = require('../compositors/block_compositor.js');

async function compose_maket(coreData, appData) {
    try {
        const contents = await pageContentController.getPageContentByContentId(appData.mainPageInfo.content_id);

        var mainPageData = {
            metakeywords: appData.mainPageInfo.metakeywords,
            metadescription: appData.mainPageInfo.metadescription,
            title: appData.mainPageInfo.title
        };

        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            switch (content.block_type) {
                case Blocks.Image:
                    const imagesData = await imagesController.getImagesById(content.block_content);
                    mainPageData.imageUrl = imagesData ? '../img/big/' + imagesData.url : '';
                    break;
                case Blocks.FormattedText:
                    mainPageData.tableName = content.block_content;
                    break;
            }
        }
        return mainPageData;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

async function compose_maket_catalog(coreData, appData) {
    try {
        const headerData = await pageContentController.getPageContentByContentId(appData.mainPageInfo.content_id);

        var mainPageData = {
            metakeywords: appData.mainPageInfo.metakeywords,
            metadescription: appData.mainPageInfo.metadescription,
            title: appData.mainPageInfo.title
        };

        for (var i = 0; i < headerData.length; i++) {
            var data = headerData[i];
            switch (data.block_type) {
                case Blocks.FormattedText:
                    mainPageData.tableName = data.block_content;
                    break;
            }
        }
        return mainPageData;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

async function compose_edit_maket(coreData, appData) {
    try {
        const contents = await pageContentController.getPageContentByContentId(appData.content_id);
        var page = "<form action='/save-main-page' method=post enctype='multipart/form-data' id='form1'>";
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            page += await composeEditCoreData(coreData, appData);
            switch (content.block_type) {
                case Blocks.Image:
                    page += await composeEditImage(coreData.logFilePath, content.block_content);
                    break;
            }
        }
        page += '</form>';
        return page;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

async function compose_save_form(coreData, appData) {
    try {
        return `
        <div class="mt-4">
        <button type="button" class="btn btn-primary" onclick="resetMaket()">Отменить</button>
        <button type="button" class="btn btn-primary" onclick="saveMaket(${appData.coreDataList.content_id})">Сохранить</button>
        </div>
        `;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

async function compose_maket_edit_catalog(coreData, appData) {
    try {
        const contents = await pageContentController.getPageContentByContentId(appData.coreDataList.content_id);

        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];

            var blockHTML = '<div id="editor">';

            switch (content.block_type) {
                case Blocks.FormattedText:
                    blockHTML += await blockCompositor.composeFormattedText(content.block_content);
                    break;
            }
            blockHTML += '</div>';
        }
        return blockHTML;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    compose_maket,
    compose_maket_catalog,
    compose_maket_edit_catalog,
    compose_edit_maket,
    compose_save_form
};