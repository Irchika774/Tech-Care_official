# 🧪 Test Plan – Tech Care Repair Scheduling System

---

## 1. Summary
This test plan provides an overview of the testing activities for the
Tech Care web application. The focus of this plan is to verify the
technician-side functionalities of the system and ensure that the
application performs as expected. The test plan acts as a guideline
for conducting systematic and effective manual testing throughout
the development lifecycle.

---

## 2. Description
The purpose of this test plan is to define the objectives, scope, and
test coverage for testing the Tech Care system from the technician’s
perspective.

The main objectives of testing are to validate technician registration
and login, ensure correct dashboard functionality, verify service and
appointment management features, and confirm accurate payment and
feedback handling.

The scope of testing includes all core technician-side features such
as authentication, dashboard access, service management, appointment
handling, notifications, payment and earnings, and feedback and rating
display. Automated testing and performance testing are not included
in this test plan.

Test coverage is achieved through manual functional testing using
checklists and detailed test cases, supported by screenshots as
evidence of execution.

---

## 3. Test Strategy
The overall test strategy is based on manual functional testing using
a black-box approach. The system is tested without considering the
internal code structure, focusing only on inputs and expected outputs.

Both positive and negative testing techniques are applied. Positive
testing ensures that the system works correctly with valid inputs,
while negative testing verifies proper error handling for invalid
inputs. Boundary value testing is also used where applicable to
validate input limits. User interface and usability testing are
performed to ensure ease of use and clarity.

Testing activities are documented using Markdown files and managed
through GitHub to maintain version control and traceability.

---

## 4. Test Environment
Testing is conducted in a web-based environment that closely matches
the production setup. The Tech Care application is accessed through
modern web browsers such as Google Chrome and Microsoft Edge on
desktop and mobile devices.

The frontend of the application is developed using React.js, while
the backend is implemented using Node.js with Express.js. MongoDB is
used as the database, and JWT is used for secure authentication.
The application is hosted using Netlify.

Screenshots are captured during test execution to provide visual
evidence of test results and stored within the project repository.

---
