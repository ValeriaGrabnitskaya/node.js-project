const { getImages } = require('../shared/shared-image-building.js');
const { addLog } = require('../logging/log.js');
const coreDataController = require('../db/controllers/core-data-controller.js');
const cafeBlockNameController = require('../db/controllers/cafe-block-name-controller');
const pageContentController = require('../db/controllers/page_content_controller');

async function composeHeader(header) {
    return `<h3 class="mt-3">${header}</h3>`;
}

async function composeImage(image) {
    const imageUrl = '../img/big/' + image.url;
    return `<img src="${imageUrl}" class="img-fluid" alt="${image.code}">`;
}

async function composeHtmlText(htmlText) {
    return htmlText;
}

async function composeText(text) {
    return `<p class="mt-3">${text}</p>`;
}

async function composeTable(tableColumnArray) {
    const cafeBlockNames = await cafeBlockNameController.getCafeBlockNames();
    const cafeBlockIds = cafeBlockNames.map((obj) => obj.id);

    var columnsObject = [];

    tableColumnArray.split(';').map((column) => {
        if (cafeBlockIds.indexOf(+column) != -1) {
            columnsObject.push(cafeBlockNames[cafeBlockIds.indexOf(+column)]);
        }
    });

    var tableColumnts = '';

    columnsObject.map((column) => {
        tableColumnts += `<th>${column.name}</th>`;
    });

    const pageContents = await pageContentController.getCafePageContent(cafeBlockIds);

    var mapPageContent = [];
    var object = {};

    for (var i = 0; i < pageContents.length; i++) {
        const item = pageContents[i];

        if (i === pageContents.length - 1) {
            object[item.cafe_block_id] = item.block_content;
            mapPageContent.push(object);
            object = {};
        } else {
            if (Object.keys(object).length == 0) {
                object.content_id = item.content_id;
                object[item.cafe_block_id] = item.block_content;
            } else if (item.content_id === object.content_id) {
                object[item.cafe_block_id] = item.block_content;
            } else {
                mapPageContent.push(object);
                object = {};
                object.content_id = item.content_id;
                object[item.cafe_block_id] = item.block_content;
            }
        }
    }

    var finalPageContent = [];

    for (var i = 0; i < mapPageContent.length; i++) {
        var pageContent = mapPageContent[i];
        const coreData = await coreDataController.getCoreDataByContentId(mapPageContent[i].content_id);
        pageContent.url_code = coreData.url_code;
        finalPageContent.push(pageContent);
    }

    var tableRows = '';

    finalPageContent.forEach((content) => {
        tableRows += '<tr>';
        cafeBlockIds.forEach((blockId, index) => {
            if(index === 0) {
                tableRows += `<td><a href="/cafe-${content.url_code}">${content[blockId]}</a></td>`;
            } else {
                tableRows += `<td>${content[blockId]}</td>`;
            }
        })
        tableRows += '</tr>';
    })

    return `
    <table class="table table-bordered mt-4">
        <thead class="thead-light">
            <tr>${tableColumnts}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
    </table>
    `;
}

async function composeEditImage(logFilePath, block_content) {

    const image = await getImages(logFilePath, block_content);
    return `
    <div class="form-group">
        <p>Текущая картинка</p>
        <img src="../img/small/${image}" alt="Current image" class="mb-3">
        <input type="text" name='imageId' value="${block_content}" hidden><br>
        <input type="file" name='image' onchange="previewFile()"><br>
        <div class="mt-3 mb-3">
            <img id="image" src="" height="200" alt="Image preview...">
        </div>
    </div>
    `;
}

async function composeEditHeader(content) {
    return `
    <div class="form-group">
        <label>Заголовок текста</label>
        <input class="form-control" type="text" name='name-${content.id}' value="${content.block_content}">
    </div>`;
}

async function composeEditHtmlText(content) {
    return `<div class="form-group">
    <input class="form-control" type="text" id="html" name='html-${content.id}' value="" hidden>
    <div id="editor">${content.block_content}</div>
    </div>`;
}

async function composeEditText(content) {
    return `
    <div class="form-group">
        <label>Адрес</label>
        <input class="form-control" type="text" name='name-${content.id}' value="${content.block_content}">
    </div>`;
}

async function composeEditCoreData(coreData, appData) {
    try {
        const coreData = await coreDataController.getCoreDataByContentId(appData.content_id);
        return `
        <input type="text" name='content_id' value="${coreData.content_id}" hidden><br>
        <div class="form-group">
            <label>Ключевые слова для поисковиков (meta keywords)</label>
            <input class="form-control" type="text" name='metakeywords' value="${coreData.metakeywords}">
        </div>
        <div class="form-group">
            <label>Описание для поисковиков (meta description)</label>
            <input class="form-control" type="text" name='metadescription' value="${coreData.metadescription}">
        </div>
        <div class="form-group">
            <label>Заголовок всей страницы (title)</label>
            <input class="form-control" type="text" name='title' value="${coreData.title}">
        </div>
        `
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

module.exports = {
    composeHeader,
    composeImage,
    composeHtmlText,
    composeText,
    composeTable,
    composeEditImage,
    composeEditHeader,
    composeEditHtmlText,
    composeEditText,
    composeEditCoreData
};