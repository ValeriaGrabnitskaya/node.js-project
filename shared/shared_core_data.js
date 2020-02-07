const coreDataController = require('../db/controllers/core-data-controller.js');
const coreCafeController = require('../db/controllers/core-cafe-controller');

async function getCoreData(content_id) {
    var coreData = await coreDataController.getCoreDataByContentId(content_id);
    if (!coreData) {
        coreData = await coreCafeController.getCoreCafeDataByContentId(content_id);
        coreData.isCafe = 1;
    } else {
        coreData.isCafe = 0;
    }
    return coreData;
}

async function updateCoreDataByContentId(coreData) {
    if (+coreData.is_cafe) {
        await coreCafeController.updateCoreCafeDataByContentId(coreData);
    } else {
        await coreDataController.updateCoreDataByContentId(coreData);
    }
}

module.exports = {
    getCoreData,
    updateCoreDataByContentId
}