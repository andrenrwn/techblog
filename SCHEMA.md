# Resource Links

APIs
====

Database Diagram Tool
=====================

Quick Database Diagrams (QuickDBD) is a simple online tool to quickly draw database diagrams by typing.

https://www.quickdatabasediagrams.com/  ->  Click "Try The App"

Use QuickDBD to render the EER diagram
https://app.quickdatabasediagrams.com/#/

```
Article
-
id PK int
parent FK >- Article.id
user_id FK >- User.id
version float
title string
content string
status string

ArticleKeyword
-
article_id int PK FK >- Article.id
keyword_id int PK FK >- Keyword.id

RelatedArticle
-
article_id PK FK >- Article.id
related_article_id PK FK >- Article.id
relation string

Keyword
-
id PK int
keyword string

Comment
-
id PK int
parent FK >- Comment.id
user_id FK >- User.id
article_id FK >- Article.id
content string

User
-
id PK int
name string
alias string
email string
password string
admin boolean
```
