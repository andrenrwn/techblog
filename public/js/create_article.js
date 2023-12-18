var editor = window.pell.init({
    element: document.getElementById('editor'),
    defaultParagraphSeparator: 'p',
    actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        'paragraph',
        'quote',
        'olist',
        'ulist',
        'code',
        'line',
        'link',
        'image',
        {
            name: 'save',
            title: 'Save',
            icon: '🖫',
            result: () => {
                document.getElementById("save").click();
            }
        }
    ],
    onChange: function (html) {
        document.getElementById('text-output').innerHTML = html
        document.getElementById('html-output').textContent = html
    },
    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content overflow-scroll h-screen',
        selected: 'pell-button-selected'
    }
});

async function article_save(event) {
    event.preventDefault();

    const title = document.getElementById('articletitle').value.trim();
    const content = editor.content.innerHTML;
    const version = document.getElementById('articleversion').value.trim();
    const parent = document.getElementById('articleparent').value.trim();
    const status = document.getElementById('articlestatus').value.trim();

    console.log(JSON.stringify({ parent, version, title, content, status }));

    if (title && content) {
        const response = await fetch('/api/articles', {
            method: 'POST',
            body: JSON.stringify({ parent, version, title, content, status }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log(JSON.stringify(response, null, 4));
            // alert(JSON.stringify(response, null, 4)); // debug log
            document.location.replace('/');
        } else {
            console.log(response.statusText);
            // alert(response.statusText); // debug log
        };
    } else {
        alert("Please enter a title and content");
    };
};

// document.querySelector('#save').addEventListener('click', article_save);
