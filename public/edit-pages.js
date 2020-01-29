async function editPage(contentId) {
    const fetchOptions = {
        method: "get",
        headers: {
            'Accept': "application/json"
        }
    };
    const response = await fetch(`/get-edit-page-data/${contentId}`, fetchOptions);
    if (response.ok) {
        const data = await response.json();
    }
}