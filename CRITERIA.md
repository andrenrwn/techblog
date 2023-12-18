# Criteria Checklist Guide

GIVEN a CMS-style blog site

WHEN I visit the site for the first time
THEN I am presented with the homepage, which includes existing blog posts if any have been posted; navigation links for the homepage and the dashboard; and the option to log in

- Home page can be reached via the top left title icon
- Login can be reached via the top right greyed-out avatar icon

WHEN I click on the homepage option
THEN I am taken to the homepage


WHEN I click on any other links in the navigation
THEN I am prompted to either sign up or sign in

- The login option and avatar icon wil direct users to the login/signup page.
- All visitors can view all articles and comments
- Links that require a logged in user (create, edit, delete article, create, delete comment) are only rendered if the user's has logged in (via an existing expressjs session).

WHEN I choose to sign up
THEN I am prompted to create a username and password


WHEN I click on the sign-up button
THEN my user credentials are saved and I am logged into the site


WHEN I revisit the site at a later time and choose to sign in
THEN I am prompted to enter my username and password


WHEN I am signed in to the site
THEN I see navigation links for the homepage, the dashboard, and the option to log out


WHEN I click on the homepage option in the navigation
THEN I am taken to the homepage and presented with existing blog posts that include the post title and the date created


WHEN I click on an existing blog post
THEN I am presented with the post title, contents, post creator’s username, and date created for that post and have the option to leave a comment

- I opted early to use an alias of the username in place of a username for privacy protection

WHEN I enter a comment and click on the submit button while signed in
THEN the comment is saved and the post is updated to display the comment, the comment creator’s username, and the date created

WHEN I click on the dashboard option in the navigation
THEN I am taken to the dashboard and presented with any blog posts I have already created and the option to add a new blog post

Solution:
- The side panel contains sections for both my posts, and all posts.
- The dashboard works for logged in and non-logged in visitors.
- The option to create a new blog post is "Create Article", accessible for logged-in users

WHEN I click on the button to add a new blog post
THEN I am prompted to enter both a title and contents for my blog post


WHEN I click on the button to create a new blog post
THEN the title and contents of my post are saved and I am taken back to an updated dashboard with my new blog post

- Click on "Save" will create/save the article into the database

WHEN I click on one of my existing posts in the dashboard
THEN I am able to delete or update my post and taken back to an updated dashboard

- From the dashboard, clicking on Edit will draw down the editor
- The Edit and Delete button will only render for articles owned by the logged-in user.

WHEN I click on the logout option in the navigation
THEN I am signed out of the site


WHEN I am idle on the site for more than a set time
THEN I am able to view posts and comments but I am prompted to log in again before I can add, update, or delete posts

- Handled automatically by expressjs sessions

