# Secrets

An anonymous secret sharing website, which users can log in securely to keep their identity hidden.

Project folder has multiple app.js files to show different type of security measures.

HTML/CSS/JS (EJS emphasis)

Project from [Udemy: The Complete 2022 Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/), with extra self-imposed functionalities including:
 - Adding extra login options
 - Create measures to prevent multiple user entries of the same user from different sources.
 
## Key skills learnt
 - Implementing different type of security and authorisation measures. This includes:
    - Encrpyting and decrpyting user passwords (**encryption**)
    - Hashing passwords (**md5**)
    - Hashing AND salting passwords (**bcrypt**)
    - Cookies and using 3rd party security systems e.g. Google (**Passportjs**)
 - Implementing the use of databases into projects using **Mongoose** and **MongoDB**.
 - 

 ## Difficulties and how I overcame them
  - <details> <summary>Errors with duplicate user infos (e.g. Same user from Facebook and Google, and email)</summary><p>Searched error code through git forums and found an issue thread (https://github.com/saintedlama/passport-local-mongoose/issues/106) stating to clear the user schema, as it causes a clash when trying to insert the same username twice into the database.</p></details>
  - <details><summary>Implementing 3rd party security systems correctly</summary><p>Followed the Passportjs documentation on how to correctly implement Google and Facebook.</p></details>

<img width="1311" alt="Screen Shot 2022-03-23 at 3 27 15 pm" src="https://user-images.githubusercontent.com/90999777/159624310-38894319-298b-4b99-9a68-fd9dddc0f0f4.png">
<img width="1284" alt="Screen Shot 2022-03-23 at 3 27 27 pm" src="https://user-images.githubusercontent.com/90999777/159624317-f61783c6-cb0a-42fc-aee8-0d201de64cac.png">
<img width="1287" alt="Screen Shot 2022-03-23 at 3 28 41 pm" src="https://user-images.githubusercontent.com/90999777/159624321-8a23f3ce-23c8-430b-ab94-aa67eef231e1.png">
<img width="1241" alt="Screen Shot 2022-03-23 at 3 29 14 pm" src="https://user-images.githubusercontent.com/90999777/159624334-a63ff658-5c31-4c09-9421-4e685663c98a.png">
<img width="1300" alt="Screen Shot 2022-03-23 at 3 29 24 pm" src="https://user-images.githubusercontent.com/90999777/159624345-62cdcda3-90fb-4f33-a49c-054c13df74a1.png">


