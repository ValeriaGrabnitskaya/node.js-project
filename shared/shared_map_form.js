async function mapSaveEditPage(requestBody) {
    var updateBody = {
        coreData: {},
        pageData: {}
    }
    for (key in requestBody) {
        if (/name-\d/.test(key)) {
            var id = key.split('-')[1];
            updateBody.pageData[id] = requestBody[key];
        } else if (/html-\d/.test(key)) {
            var id = key.split('-')[1];
            updateBody.pageData[id] = requestBody[key];
        } else if (/selection-\d/.test(key)) {
            var id = key.split('-')[1];
            updateBody.pageData[id] = '';
            updateBody.pageData[id] += requestBody[key];
        }
        else {
            updateBody.coreData[key] = requestBody[key];
        }
    }
    return updateBody;
}

module.exports = {
    mapSaveEditPage
};