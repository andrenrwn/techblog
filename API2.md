## Members

<dl>
<dt><a href="#GET /api/articles/&order=ASC?attr=modified_at">GET /api/articles/&order=ASC?attr=modified_at</a> ⇒ <code>ARRAY</code></dt>
<dd><p>Get all articles, including their keywords and users</p>
</dd>
<dt><a href="#GET /api/articles/_id">GET /api/articles/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Get an article based on its article id</p>
</dd>
<dt><a href="#POST /api/articles">POST /api/articles</a> ⇒ <code>Object</code></dt>
<dd><p>Create a new article into the database by the user&#39;s id, including its associated Keywords. Users must be logged in to post articles.</p>
</dd>
<dt><a href="#PUT /api/articles/_id">PUT /api/articles/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Modify an article by id.</p>
</dd>
<dt><a href="#DELETE /api/articles/_id">DELETE /api/articles/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Delete an article based on its article id</p>
</dd>
<dt><a href="#GET /api/comments/&order=ASC?attr=modified_at?articleid=<articleid>?userid=<userid>">GET /api/comments/&order=ASC?attr=modified_at?articleid=<articleid>?userid=<userid></a> ⇒ <code>ARRAY</code></dt>
<dd><p>Get comments from an article and/or userid</p>
</dd>
<dt><a href="#POST /api/comments">POST /api/comments</a> ⇒ <code>JSON</code></dt>
<dd><p>Create a new comment into the database by article and if this is a reply (by parent comment id). Users must be logged in to post comments.</p>
</dd>
<dt><a href="#PUT /api/comments/_id">PUT /api/comments/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Modify a comment by id.</p>
</dd>
<dt><a href="#DELETE /api/comments/_id">DELETE /api/comments/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Delete an article based on its article id</p>
</dd>
<dt><a href="#GET /api/keywords/&order=ASC">GET /api/keywords/&order=ASC</a> ⇒ <code>ARRAY</code></dt>
<dd><p>Get all keywords and its associated articles</p>
</dd>
<dt><a href="#GET /api/keywords/_id">GET /api/keywords/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Get a keyword by id and list its associated articles</p>
</dd>
<dt><a href="#POST /api/keywords">POST /api/keywords</a> ⇒ <code>JSON</code></dt>
<dd><p>Find or create a new keyword</p>
</dd>
<dt><a href="#PUT /api/keywords/_oldkeyword">PUT /api/keywords/:oldkeyword</a> ⇒ <code>JSON</code></dt>
<dd><p>Change the :oldkeyword to a new keyword that&#39;s defined in the POST body</p>
</dd>
<dt><a href="#DELETE /api/keywords/_oldkeyword">DELETE /api/keywords/:oldkeyword</a> ⇒ <code>JSON</code></dt>
<dd><p>Delete :oldkeyword from the database [TBD: Should only be available to the admin user]</p>
</dd>
<dt><a href="#POST /api/users/">POST /api/users/</a> ⇒ <code>JSON</code></dt>
<dd><p>Creates a new user from the sign-up form</p>
</dd>
<dt><a href="#PUT /api/users/">PUT /api/users/</a> ⇒ <code>JSON</code></dt>
<dd><p>Modifies user information. Logged in users can only modify their own data.</p>
</dd>
<dt><a href="#POST /api/users/login">POST /api/users/login</a> ⇒ <code>JSON</code></dt>
<dd><p>Logs in a user using their email and passwords. Successful login populates the expressjs session</p>
</dd>
<dt><a href="#POST /api/users/logout">POST /api/users/logout</a></dt>
<dd><p>Logs out a currently logged in user session</p>
</dd>
<dt><a href="#GET /api/users/logout">GET /api/users/logout</a></dt>
<dd><p>Logs out a currently logged in user session and redirects them to the home page.
             Can be linked directly as an a href</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#validateCommentInput">validateCommentInput(req)</a> ⇒ <code>ARRAY</code></dt>
<dd><p>validateCommentInput(req) validates the HTTP POST body JSON content</p>
</dd>
</dl>

<a name="GET /api/articles/&order=ASC?attr=modified_at"></a>

## GET /api/articles/&order=ASC?attr=modified\_at ⇒ <code>ARRAY</code>
Get all articles, including their keywords and users

**Kind**: global variable  
**Returns**: <code>ARRAY</code> - Array of all articles in JSON format | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| ?attr | <code>STRING</code> | = 'modified_at|created_at|title' --- select the column to sort by. Default: 'created_at' |
| ?order | <code>STRING</code> | = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC' |

<a name="GET /api/articles/_id"></a>

## GET /api/articles/:id ⇒ <code>JSON</code>
Get an article based on its article id

**Kind**: global variable  
**Returns**: <code>JSON</code> - Article in JSON format | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | -- article id |

<a name="POST /api/articles"></a>

## POST /api/articles ⇒ <code>Object</code>
Create a new article into the database by the user's id, including its associated Keywords. Users must be logged in to post articles.

**Kind**: global variable  
**Returns**: <code>Object</code> - JSON object returning the newly created article {{ "id": "<newid>", "title": <new title>", ... }, ARRAY } and ARRAY JSON keywords that was assigned or created | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| parent | <code>INTEGER</code> | A parent referring to another article_id. Parents can be used to denote followups, newer versions, or updates to an article. |
| version | <code>FLOAT</code> | A version number to attach to the article |
| title | <code>STRING</code> | The title of the article |
| content | <code>STRING</code> | The content of the article |
| status | <code>STRING</code> | A string indicating the article's status |
| keywords | <code>ARRAY</code> | An array of INTEGER strings IDs. ie. "keywords": ['5g','tech'] |

<a name="PUT /api/articles/_id"></a>

## PUT /api/articles/:id ⇒ <code>JSON</code>
Modify an article by id.

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON message reporting the number of records updated | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| parent | <code>INTEGER</code> | A parent referring to another article_id. Parents can be used to denote followups, newer versions, or updates to an article. |
| version | <code>FLOAT</code> | A version number to attach to the article |
| title | <code>STRING</code> | The title of the article |
| content | <code>STRING</code> | The content of the article |
| status | <code>STRING</code> | A string indicating the article's status |
| keywords | <code>ARRAY</code> | An array of INTEGER strings IDs. ie. "keywords": ['5g','tech'] |

<a name="DELETE /api/articles/_id"></a>

## DELETE /api/articles/:id ⇒ <code>JSON</code>
Delete an article based on its article id

**Kind**: global variable  
**Returns**: <code>JSON</code> - Article in JSON format | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | -- article id |

<a name="GET /api/comments/&order=ASC?attr=modified_at?articleid=<articleid>?userid=<userid>"></a>

## GET /api/comments/&order=ASC?attr=modified\_at?articleid=<articleid>?userid=<userid> ⇒ <code>ARRAY</code>
Get comments from an article and/or userid

**Kind**: global variable  
**Returns**: <code>ARRAY</code> - Array of all of the article's comments in JSON format | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| ?attr | <code>STRING</code> | = 'modified_at|created_at' --- select the column to sort by. Default: 'created_at' |
| ?order | <code>STRING</code> | = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC' |
| ?articleid | <code>INTEGER</code> | = The article id that the comments belong to. 0 means all articles. |
| ?userid | <code>INTEGER</code> | = The user id that the comments belong to. 0 means all users. |

<a name="POST /api/comments"></a>

## POST /api/comments ⇒ <code>JSON</code>
Create a new comment into the database by article and if this is a reply (by parent comment id). Users must be logged in to post comments.

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON object returning the newly created comment { "id": "<newid>", "content": "<comment content>"", ... } | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| parent | <code>INTEGER</code> | A parent comment referring to another comment. Parent should override article_id |
| user_id | <code>INTEGER</code> | The user id associated with this comment. |
| article_id | <code>INTEGER</code> | The article the comment is attached to. |
| content | <code>STRING</code> | The content of the comment |

<a name="PUT /api/comments/_id"></a>

## PUT /api/comments/:id ⇒ <code>JSON</code>
Modify a comment by id.

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON message reporting the number of records updated | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| parent | <code>INTEGER</code> | A parent comment referring to another comment. Parent should override article_id |
| user_id | <code>INTEGER</code> | The user id associated with this comment. |
| article_id | <code>INTEGER</code> | The article the comment is attached to. |
| content | <code>STRING</code> | The content of the comment |

<a name="DELETE /api/comments/_id"></a>

## DELETE /api/comments/:id ⇒ <code>JSON</code>
Delete an article based on its article id

**Kind**: global variable  
**Returns**: <code>JSON</code> - Message describing result of how many rows are deleted | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | -- article id |

<a name="GET /api/keywords/&order=ASC"></a>

## GET /api/keywords/&order=ASC ⇒ <code>ARRAY</code>
Get all keywords and its associated articles

**Kind**: global variable  
**Returns**: <code>ARRAY</code> - Array of all keywords in JSON format | JSON error message if failed  

| Param | Type | Description |
| --- | --- | --- |
| ?order | <code>STRING</code> | = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC' |

<a name="GET /api/keywords/_id"></a>

## GET /api/keywords/:id ⇒ <code>JSON</code>
Get a keyword by id and list its associated articles

**Kind**: global variable  
**Returns**: <code>JSON</code> - Array of all keywords in JSON format | JSON error message if failed  
<a name="POST /api/keywords"></a>

## POST /api/keywords ⇒ <code>JSON</code>
Find or create a new keyword

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON message and object returning the newly created keyword | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| keyword | <code>STRING</code> | A keyword string |

<a name="PUT /api/keywords/_oldkeyword"></a>

## PUT /api/keywords/:oldkeyword ⇒ <code>JSON</code>
Change the :oldkeyword to a new keyword that's defined in the POST body

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON message whether a record is updated or not | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object with the following key/value pair: |
| keyword | <code>STRING</code> | A keyword string |

<a name="DELETE /api/keywords/_oldkeyword"></a>

## DELETE /api/keywords/:oldkeyword ⇒ <code>JSON</code>
Delete :oldkeyword from the database [TBD: Should only be available to the admin user]

**Kind**: global variable  
**Returns**: <code>JSON</code> - Message on how many records were deleted  

| Param | Type | Description |
| --- | --- | --- |
| :oldkeyword | <code>STRING</code> | -- an HTML URL encoded string |

<a name="POST /api/users/"></a>

## POST /api/users/ ⇒ <code>JSON</code>
Creates a new user from the sign-up form

**Kind**: global variable  
**Returns**: <code>JSON</code> - The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| name | <code>STRING</code> | Username |
| alias | <code>STRING</code> | User's alias, attached to posts and comments. |
| email | <code>STRING</code> | User's email |
| password | <code>STRING</code> | User's password |

<a name="PUT /api/users/"></a>

## PUT /api/users/ ⇒ <code>JSON</code>
Modifies user information. Logged in users can only modify their own data.

**Kind**: global variable  
**Returns**: <code>JSON</code> - The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| name | <code>STRING</code> | Username |
| alias | <code>STRING</code> | User's alias, attached to posts and comments. |
| email | <code>STRING</code> | User's email |
| password | <code>STRING</code> | User's password |

<a name="POST /api/users/login"></a>

## POST /api/users/login ⇒ <code>JSON</code>
Logs in a user using their email and passwords. Successful login populates the expressjs session

**Kind**: global variable  
**Returns**: <code>JSON</code> - The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| email | <code>STRING</code> | User's email |
| password | <code>STRING</code> | User's password |

<a name="POST /api/users/logout"></a>

## POST /api/users/logout
Logs out a currently logged in user session

**Kind**: global variable  
<a name="GET /api/users/logout"></a>

## GET /api/users/logout
Logs out a currently logged in user session and redirects them to the home page.
             Can be linked directly as an a href

**Kind**: global variable  
<a name="validateCommentInput"></a>

## validateCommentInput(req) ⇒ <code>ARRAY</code>
validateCommentInput(req) validates the HTTP POST body JSON content

**Kind**: global function  
**Returns**: <code>ARRAY</code> - [ success, status, message ] --- [ if validated, status value, error message ]  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>OBJECT</code> | -- expresjs req (request) object containing the HTTP body in req.body |

