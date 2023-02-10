# Project Name
Ironews 
## Description

A regularly updated website, run by the administrator, that creates, edits and delete the articles.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **events list** - As a user I want to see all the events available so that I can choose which ones I want to attend
- **events create** - As a user I want to create an event so that I can invite others to attend
- **events detail** - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend 
- **event attend** - As a user I want to be able to attend to event so that the organizers can count me in

## Backlog

List of other features outside of the MVPs scope

User profile:
- see the articles 
- see the comments of each article
- comment each articles 
- delete the comment of his

Admin profile:
- see the articles 
- see the comments of each article
- comment each articles 
- delete the comment of his
- write articles
- edit articles
- delete articles

Homepage
- ...


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
     - email
    - password
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - email
    - password
- POST /auth/logout
  - body: (empty)

- GET /news
  - renders the news list + the create form
- POST /news/create 
  - redirects to / if user is anonymous
  - body: 
    - title
    - category
    - image
    - content
- GET /news/:id
  - renders the event detail page
  - includes the list of attendees
  - attend button if user not attending yet
- POST /news/:id/edit
- POST /news/:id/delete
 


## Models

User model
 
```
email: String
password: String
```

News model
title: String
category: String
image: String
content: String
owner: mongoose.Types.ObjectId
``` 
Comments model
newsId: mongoose.Schema.Types.ObjectId,
userId: mongoose.Schema.Types.ObjectId,
commentContent: String,
  
## Links

### Trello

### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link]()

### Slides

The url to your presentation slides

[Slides Link]()

