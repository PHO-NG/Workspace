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

 ## Difficulties and how I overcame them
  - <details> <summary>Errors with duplicate user infos (e.g. Same user from Facebook and Google, and email)</summary><p>Searched error code through git forums and found an [Issue Thread](https://github.com/saintedlama/passport-local-mongoose/issues/106), stating to clear the user schema, as it caused a clash when trying to insert the same username twice into the database.</p></details>
  - <details><summary>Implementing 3rd party security systems correctly</summary><p>Followed the Passportjs documentation on how to correctly implement Google and Facebook.</p></details>
