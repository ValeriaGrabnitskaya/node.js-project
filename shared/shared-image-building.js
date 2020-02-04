const fsp = require('fs').promises;
const Jimp = require('jimp');
const path = require('path');

const { addLog } = require('../logging/log.js')
const { getImagesById } = require('../db/controllers/images-controller');

async function getImages(logFilePath, image_content) {
    var image = null;
    try {
        image = await getImagesById(image_content);
        const smallImagesPath = path.resolve(__dirname, "../public/img/small", image.url);
        const stats = await fsp.stat(smallImagesPath);
        if (stats.isFile()) {
            addLog(logFilePath, `Есть готовая маленькая картинка ${image.url}`);
            return image.url;
        } else {
            return null;
        }
    } catch (error) {
        addLog(logFilePath, `Нет готовой маленькой картинки, будем сжимать большую и сохранять результат на будущее`);
        const bigImagesPath = path.resolve(__dirname, "../public/img/big", image.url);
        const smallImagesPath = path.resolve(__dirname, "../public/img/small", image.url);

        let compressStartDT = new Date();
        await compressImage(bigImagesPath, smallImagesPath, 300);
        let compressDurationMS = (new Date()) - compressStartDT;
        addLog(logFilePath, `Сохранена маленькая картинка ${image.url}, сжатие заняло ${compressDurationMS} мс`);

        return image.url;
    }
}

// масштабирует картинку из sourcePFN в resultPFN с указанной шириной с сохранением пропорций
async function compressImage(bigImagesPath, smallImagesPath, newWidth) {

    let result = await Jimp.read(bigImagesPath);
    const { width, height } = result.bitmap; // это размеры большой картинки

    let newHeight = height / width * newWidth; // ширину маленькой картинки знаем, вычисляем высоту маленькой

    // при любом способе записи файла он некоторое время виден в файловой системе с длиной 0
    // а у нас в get-запросе определяется, нет ли уже сохранённого файла с нужным именем, и пустой будет обнаружен и возвращён клиенту
    // поэтому, ВСЕГДА сначала (медленно) пишем в файл со ВРЕМЕННЫМ именем, а потом переименовываем файл в нужное имя (это моментально)

    // но временное имя файла надо сделать с таким же расширением, с каким будет постоянное
    // т.к. jimp определяет ФОРМАТ записи (jpeg/png) по РАСШИРЕНИЮ файла (глупо, конечно)
    let resultTempPFN = getTempFileName(smallImagesPath);

    result.resize(newWidth, newHeight);
    result.quality(100);
    await result.writeAsync(resultTempPFN); // медленно пишем в файл со временным именем

    await fsp.rename(resultTempPFN, smallImagesPath); // быстро переименовываем в нужное имя
}

// дописывает заданный постфикс к имени (не расширению) файла
function getTempFileName(targetPFN, postfix = "_small") {
    const targetPathParts = path.parse(targetPFN);
    return targetPathParts.dir + path.sep + targetPathParts.name + postfix + targetPathParts.ext;
}

module.exports = {
    getImages
};