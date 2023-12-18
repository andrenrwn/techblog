// /articles/:id

// Set up the article editor container
var editor = window.pell.init({
    element: document.getElementById('articleeditor'),
    defaultParagraphSeparator: 'p',
    onChange: function (html) {
        document.getElementById('text-output').innerHTML = html
        document.getElementById('html-output').textContent = html
    },
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
                document.getElementById("update").click();
            }
        }
    ],
    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content overflow-scroll h-64',
        selected: 'pell-button-selected'
    }
});

console.log(editor.actions);
// editor.actions.push({

// });

// Preload content of loaded article in DOM into article editor
editor.content.innerHTML = document.getElementById('articlecontent').innerHTML;
document.getElementById('text-output').innerHTML = document.getElementById('articlecontent').innerHTML;
document.getElementById('html-output').textContent = document.getElementById('articlecontent').innerHTML;


// Set up the comment editor container
var commenteditor = window.pell.init({
    element: document.getElementById('commenteditor'),
    defaultParagraphSeparator: 'p',
    // onChange: function (html) {
    //     document.getElementById('text-output').innerHTML = html
    //     document.getElementById('html-output').textContent = html
    // },
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
                document.getElementById("commentcreate").click();
            }
        }
    ],
    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content overflow-scroll max-h-32',
        selected: 'pell-button-selected'
    }
});


// Save article 
async function article_update(event) {
    // alert(event.currentTarget.getAttribute("id"));
    event.preventDefault();

    const id = document.getElementById('articleid').textContent.trim();
    const content = editor.content.innerHTML;
    const title = document.getElementById('articletitle').value.trim();
    const version = document.getElementById('articleversion').value.trim();
    const parent = document.getElementById('articleparent').value.trim();
    const status = document.getElementById('articlestatus').value.trim();

    console.log(JSON.stringify({ id, parent, version, title, content, status }));

    if (title && content) {
        const response = await fetch(`/api/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ parent, version, title, content, status }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log("Article updated: ", JSON.stringify(response, null, 4));
            // alert(JSON.stringify(response, null, 4));
            document.location.replace(`/articles/${id}`);
        } else {
            console.log(response.statusText);
            alert(response.statusText);
        };
    } else {
        alert("Please enter a title and content");
    };
};


// Delete article 
async function article_delete(event) {
    const id = document.getElementById('articleid').textContent.trim();

    if (id) {
        if (confirm(`Are you sure you want to delete article ${id}?\nOK or Cancel.`) != true) {
            console.log("Cancelling delete article");
            return;
        }

        const response = await fetch(`/api/articles/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log("Article deleted: ", JSON.stringify(response, null, 4));
            // alert(JSON.stringify(response, null, 4));
            document.location.replace(`/articles`);
        } else {
            console.log(response.statusText);
            // alert(response.statusText);
        };
    } else {
        alert(`Cannot identify the article id ${id} to delete`);
    };
};


async function comment_create(event) {
    event.preventDefault();

    // const parent = parseInt(document.getElementById('commentparent').value.trim());
    const user_id = parseInt(document.getElementById('user_id').dataset.user_id);
    const article_id = parseInt(document.getElementById('articleid').textContent.trim());
    const content = commenteditor.content.innerHTML;

    console.log(JSON.stringify({ user_id, article_id, content }));

    if (user_id && article_id && content) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ user_id, article_id, content }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log(JSON.stringify(response, null, 4)); // debug log
            // alert(JSON.stringify(response, null, 4));
            document.location.replace(`/articles/${article_id}`);
        } else {
            console.log(response.statusText);
            // alert(response.statusText);
        };
    } else {
        alert("Need a user id, article id, and content to post a comment");
    };
};


// Delete comment 
async function comment_delete(event, comment_id) {
    event.preventDefault();
    console.log("commentid:", comment_id);
    const id = comment_id;

    if (id) {
        const article_id = parseInt(document.getElementById('articleid').textContent.trim());

        if (confirm(`Are you sure you want to delete comment ${id}?\nOK or Cancel.`) != true) {
            console.log("Cancelling delete comment");
            return;
        }

        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log("Article deleted: ", JSON.stringify(response, null, 4));
            // alert(JSON.stringify(response, null, 4));
            document.location.replace(`/articles/${article_id}`);
        } else {
            console.log(response.statusText);
            // alert(response.statusText);
        };
    } else {
        alert(`Cannot identify the article id ${id} to delete`);
    };
};




function toggle_editor(event, id) {
    const articleEditorClasses = document.getElementById(id).classList;
    const result = articleEditorClasses.toggle("hidden");
    if (result) {
        event.currentTarget.querySelector(".aeupdown").textContent = "▽";
    } else {
        event.currentTarget.querySelector(".aeupdown").textContent = "△";
    };
};

// document.querySelector('#update').addEventListener('click', article_update);
