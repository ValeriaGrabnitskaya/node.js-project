const pageContentController = require('../db/controllers/page_content_controller.js');
const imagesController = require('../db/controllers/images-controller.js');
const Blocks = require('../constants/blocks.js');

async function compose_maket_main_page(coreData, appData) {
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
                case Blocks.Image:
                    const imagesData = await imagesController.getImagesById(data.block_content);
                    mainPageData.imageUrl = imagesData ? imagesData.url : '';
                    break;
            }
        }
        return mainPageData;
    } catch (error) {
        console.log(error)
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
                    mainPageData.formHeader = data.block_content;
                    break;
            }
        }
        return mainPageData;
    } catch (error) {
        console.log(error)
    }
}

async function compose_maket_edit_catalog(coreData, appData) {
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
                    mainPageData.formHeader = data.block_content;
                    break;
            }
        }
        return mainPageData;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    compose_maket_main_page,
    compose_maket_catalog,
    compose_maket_edit_catalog
};