const pageContentController = require('../db/controllers/page_content_controller.js');
const imagesController = require('../db/controllers/images-controller.js');
const blockCompositor = require('./block_compositor.js');
const Blocks = require('../constants/blocks.js');
const { addLog } = require('../logging/log.js');

async function compose_maket(coreData, appData) {
    try {
        const contents = await pageContentController.getPageContentByContentId(appData.mainPageInfo.content_id);

        var page = '';
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            switch (content.block_type) {
                case Blocks.Image:
                    const imagesData = await imagesController.getImagesById(content.block_content);
                    page += await blockCompositor.composeImage(imagesData);
                    break;
                case Blocks.Header:
                    page += await blockCompositor.composeHeader(content.block_content);
                    break;
                case Blocks.HtmlText:
                    page += await blockCompositor.composeHtmlText(content.block_content);
                    break;
                case Blocks.Text:
                    page += await blockCompositor.composeText(content.block_content);
                    break;
                case Blocks.Table:
                    page += await blockCompositor.composeTable(content.block_content);
                    break;
            }
        }
        var mainPageData = {
            metakeywords: appData.mainPageInfo.metakeywords,
            metadescription: appData.mainPageInfo.metadescription,
            title: appData.mainPageInfo.title,
            page: page
        };
        return mainPageData;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

async function compose_edit_maket(coreData, appData) {
    try {
        const contents = await pageContentController.getPageContentByContentId(appData.content_id);
        var page = '<form id="saveForm" action="/save-page" method="POST" enctype="multipart/form-data">';
        page += await blockCompositor.composeEditCoreData(coreData, appData);
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            switch (content.block_type) {
                case Blocks.Image:
                    page += await blockCompositor.composeEditImage(coreData.logFilePath, content.block_content);
                    break;
                case Blocks.Header:
                    page += await blockCompositor.composeEditHeader(content);
                    break;
                case Blocks.HtmlText:
                    page += await blockCompositor.composeEditHtmlText(content);
                    break;
                case Blocks.Text:
                    page += await blockCompositor.composeEditText(content);
                    break;
                case Blocks.Table:
                    page += await blockCompositor.composeEditTableColumn(content);
                    break;
            }
        }
        page += `
            <button id="submit" type="submit">Сохранить</button>
        </form>
        `;
        return page;
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}


// async function compose_maket_edit_catalog(coreData, appData) {
//     try {
//         const contents = await pageContentController.getPageContentByContentId(appData.coreDataList.content_id);

//         for (var i = 0; i < contents.length; i++) {
//             var content = contents[i];

//             var blockHTML = '<div id="editor">';

//             switch (content.block_type) {
//                 case Blocks.Header:
//                     blockHTML += await blockCompositor.composeFormattedText(content.block_content);
//                     break;
//             }
//             blockHTML += '</div>';
//         }
//         return blockHTML;
//     } catch (error) {
//         console.log(error)
//     }
// }

module.exports = {
    compose_maket,
    compose_edit_maket
};