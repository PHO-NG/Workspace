# Trivia Questionnaire

A basic trivia quiz website using an online API, [Open Trivia Database](https://opentdb.com/).

HTML/CSS/JS (React emphasis)

**Solo project**

## Key skills learnt
 - How to implement API's into a web application
 - Reinforce React principles

 ## Difficulties and how I overcame them
  - <details> <summary>Questions weren't consistently showing up when starting the quiz</summary><p>Created a conditional rendering to check if questions have been added</p></details>
  - <details><summary>Struggled finding a way to store user entries and comparing it to correct answers</summary><p>Created another state storing only user's answers and correct answers. Stored all data when the user picks an answer (not beforehand)</p></details>
  - <details><summary>Correct selections weren't being highlighted as correct</summary><p>Had to make sure answers were URL decoded before comparing</p></details>
  - <details><summary>Wasn't sure on how to restart the quiz after completing it</summary><p>Decided to simply restart the whole application. This was the easiest way to clear out all the stored datas in each state.</p></details>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<img width="600" alt="Screen Shot 2022-02-05 at 4 20 11 pm" src="https://user-images.githubusercontent.com/90999777/152629825-73c657ad-83a7-4f02-bd03-d742a1946431.png">

<img width="1300" alt="Screen Shot 2022-02-05 at 4 20 30 pm" src="https://user-images.githubusercontent.com/90999777/152629891-3a57d5d0-0b26-40cb-bef5-51a02be1207d.png">

<img width="1316" alt="Screen Shot 2022-02-05 at 4 20 43 pm" src="https://user-images.githubusercontent.com/90999777/152629831-a1f51ae1-5a8a-4763-b5fe-fe52683698b1.png">
