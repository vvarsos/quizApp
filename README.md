# quizApp
Software Developer Project Assignment - Building and Managing a Scalable Web Application using a C# Web API for the backend, and only vanilla JavaScript for the frontend

# Board Games Quiz App

A simple, secure quiz application built with **ASP.NET Core Web API** (C#) for the backend and **vanilla JavaScript** for the frontend. This project demonstrates:
- A custom login form with special password validation.
- A sequential quiz flow with multiple question types.
- Final results with messages and images based on the user's score.

## Table of Contents
- [Implemented Features](#features)
- [Requirements](#requirements)
- [Setup & Run](#setup--run)
- [Unit Tests](#unit-tests)
- [How It Works](#how-it-works)

---

## Implemented Features

1. **Login**:  
   - **Username** must be `a-z` only, max 15 chars, at least 2 vowels.  
   - **Password** is `100..999` and must be `< sum(first N numbers)`.  
   - N = username length; uses `[10,20,30,...,150]` for sum check.

2. **Quiz**:  
   - Loads `quiz.json` from server; displays questions one at a time.  
   - Single-choice, multi-choice, or true/false questions.  
   - Highlights correct answers if the user is wrong.  
   - Calculates total points or percentage.  

3. **Final Results**:  
   - Loads `result.json`; maps the final score/percentage to a specific result range, message, and image.

4. **Security**:  
   - Enforces validation server-side.  
   - HTTPS-only for secure transmission.  
   - Minimal data leakage in error messages.

---

## Requirements
- A **trusted dev certificate** for HTTPS:
  dotnet dev-certs https --trust

---

## Setup & Run

- Clone or download this repository.
- Open a terminal in quizApp/Backend/.
- dotnet restore
- dotnet build
- dotnet run
- The console will say something like Now listening on: https://localhost:5001.
- Open your browser at https://localhost:5001.

---

## Unit Tests
- Basic unit tests for the AuthController logic are in the Tests folder
- To run:
  - cd quizApp/Tests
  - dotnet test

---

## How it works

- Login:
  - The user enters username/password in index.html
  - login.js sends a POST to /api/auth/login.
  - AuthController validates input. If success, returns 200, else 400/401.
- Quiz:
  - On successful login, user is redirected to quiz.html.
  - quiz.js does a GET to /api/quiz, rendering the questions from quiz.json.
  - Each question can be single-choice, multiple-choice, or true/false.
  - After each answer, user sees feedback for a few seconds, then moves on.
 - Final Results:
  - After all questions have been concluded, quiz.js fetches /api/result to load result.json.
  - Compares the final score/percentage to the minpoints..maxpoints ranges.
  - Displays a final message + image based on the matched range.
