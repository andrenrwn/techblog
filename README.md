# 💡 Tech Blog 💡

## Description

This is a tech blog site demonstrating:

- ORM (Object-Relational Modelling) using sequelize to manage database objects as Javascript objects
- MVC (Model-View-Controller) to build websites off dynamic content using handlebar templates

## Install

1. `$ git clone https://github.com/andrenrwn/techblog`

2. Configure your environment variables, database name, user, password, and API keys in .env
   `$vi .env`

3. `$ npm install`

4. Ensure the database is created in mysql
   `$ mysql -u root -p < db/schema.sql`

5. `$ node seeds/seed.js`

6. `$ nodemon server.js`

7. Browse to `https://localhost:3001/`


## Usage


## API

## Documentation generation

jsdoc-to-markdown formats the documentation in code to .md format.
Usage example:
$ node.exe node_modules/jsdoc-to-markdown/bin/cli.js -f ./controllers/api/keywordRoutes.js


## Credits

- dependencies
  - bcrypt --- cryptographic functions for password hashing
  - dotenv --- separate any database credential configuration and API keys from public repository
  - express --- middleware webserver
  - express-handlebars --- templating engine for express
  - connect-session-sequelize --- saves sessions to database
  - express-session --- keeps track of user session via encoded cookies
  - mysql2 --- javascript mysql driver
  - sequelize - javascript object relational model interface to SQL (mysql)

-dev dependencies
  - jsdoc
  - jsdoc-to-markdown --- used to automatically generate API documentation

- Parts of the express user handling code is from UT Austin Coding Bootcamp materials

