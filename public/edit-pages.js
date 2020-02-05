var myEditor = null;

async function editPage(contentId) {
    const fetchOptions = {
        method: "get",
        headers: {
            'Accept': "text/html"
        }
    };
    const response = await fetch(`/get-edit-page-data/${contentId}`, fetchOptions);
    if (response.ok) {
        const data = await response.text();
        document.getElementById('block').innerHTML = data;
        getHTMLRedactor();
    }
}

async function savePage() {
    const fetchOptions = {
        method: "post",
        headers: {
            'Content-Type': "application/json",
        },
        body: filterBody()
    };

    const response = await fetch(`/save-page`, fetchOptions);
    if (response.ok) {
        window.location.href = "/edit-pages";
    }
}

function filterBody() {
    var body = getFormData('saveForm');
    var updateBody = {
        coreData: {},
        pageData: {}
    }
    for (key in body) {
        if (/name-\d/.test(key)) {
            var id = key.split('-')[1];
            updateBody.pageData[id] = body[key];
        }else if (/html-\d/.test(key)) {
            var id = key.split('-')[1];
            updateBody.pageData[id] = getUpdateData();
        } else {
            updateBody.coreData[key] = body[key];
        }
    }
    console.log(updateBody)
    return JSON.stringify(updateBody);
}

function getFormData(formName) {
    let searchFormElements = document.forms[formName].elements;
    let params = {};

    for (var i = 0; i < searchFormElements.length; i++) {
        if (searchFormElements[i].name) {
            params = { ...params, [searchFormElements[i].name]: searchFormElements[searchFormElements[i].name].value }
        }
    }
    return params;
}

function previewFile() {
    var preview = document.getElementById('image');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}

function getHTMLRedactor() {
    if (document.querySelector('#editor')) {
        ClassicEditor
            .create(document.querySelector('#editor'))
            .then(editor => {
                myEditor = editor;
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function getUpdateData() {
    if (document.querySelector('#editor')) {
        return myEditor.getData();
    }
}