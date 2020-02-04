const { getImages } = require('../shared/shared-image-building.js');
const { addLog } = require('../logging/log.js');
const coreDataController = require('../db/controllers/core-data-controller.js');

async function composeFormattedText(content) {
    return `<h3 class="mt-3">${content}</h3>`;
}

async function composeEditImage(logFilePath, block_content) {

    const image = await getImages(logFilePath, block_content);
    return `
    <div class="form-group">
        <p>Текущая картинка</p>
        <img src="../img/small/${image}" alt="Current image" class="mb-3">
        <input type="text" name='imageId' value="${block_content}" hidden><br>
        <input type="file" name='photo' onchange="previewFile()"><br>
        <div class="mt-3 mb-3">
            <img id="image" src="" height="200" alt="Image preview...">
         </div>
    </div>
    <button type="submit">Сохранить</button>
    `;
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
            <label>Заголовок</label>
            <input class="form-control" type="text" name='title' value="${coreData.title}">
        </div>
        `
    } catch (error) {
        addLog(coreData.logFilePath, error);
    }
}

module.exports = {
    composeFormattedText,
    composeEditImage,
    composeEditCoreData
};