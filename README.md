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
