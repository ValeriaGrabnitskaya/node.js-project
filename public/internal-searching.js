async function search() {
    const fetchOptions = {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        }, 
        body: JSON.stringify(getFormData('searchForm'))
    };
    const response = await fetch(`/search`, fetchOptions);
    if (response.ok) {
        const data = await response.text();
        document.getElementById('searchResult').innerHTML = data;
    }
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