async function logIn() {
    const fetchOptions = {
        method: "post",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(getFormData("authorizationForm"))
    };
    const response = await fetch('/check-authorization', fetchOptions);
    if (response.ok) {
        const data = await response.json();
        if (data.token) {
            document.cookie = `token=${data.token}`;
            console.log(data)
            window.location.href = "/main-page";
        }
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

async function logOut() {

}
