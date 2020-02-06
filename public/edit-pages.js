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
                setUpdateHTMLData(editor);
                editor.model.document.on('change:data', () => {
                    setUpdateHTMLData(editor);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function setUpdateHTMLData(editor) {
    document.getElementsByName('html-9')[0].value = editor.getData();
}