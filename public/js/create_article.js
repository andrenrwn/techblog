var editor = window.pell.init({
    element: document.getElementById('editor'),
    defaultParagraphSeparator: 'p',
    onChange: function (html) {
        document.getElementById('text-output').innerHTML = html
        document.getElementById('html-output').textContent = html
    }
});

async function article_save(event) {
    event.preventDefault();

    const content = document.getElementById('text-output').innerHTML;
    const title = document.getElementById('title').value.trim();
    const version = document.getElementById('version').value.trim();
    const parent = document.getElementById('parent').value.trim();
    const status = document.getElementById('status').value.trim();

    console.log(JSON.stringify({ parent, version, title, content, status }));

    if (title && content) {
        const response = await fetch('/api/articles', {
            method: 'POST',
            body: JSON.stringify({ parent, version, title, content, status }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log(JSON.stringify(response, null, 4));
            alert(JSON.stringify(response, null, 4));
            document.location.replace('/');
        } else {
            console.log(response.statusText);
            alert(response.statusText);
        };
    } else {
        alert("Please enter a title and content");
    };
};

// document.querySelector('#save').addEventListener('click', article_save);
