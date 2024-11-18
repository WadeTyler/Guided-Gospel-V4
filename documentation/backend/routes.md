# Routes  
This document contains the required information to understand the routes for this project. All backend routes are prefaced with /api.  

## User Routes  
User routes are for user authentication and performing CRUD operations for the user's account.  

### /api/user  
Returns all of the user's value except their password.  
Method: GET  
Content-Type: application/json  

### /api/user/signup  
Initiates the signup process. Will send a email to the user's specified email with a verification code.  
Method: POST  
Content-Type: application/json  
Body: {  
  username, firstname, lastname, email, password  
}  

### /api/user/completesignup  
Completes the signup process.  
Method: POST  
Content-Type: application/json  
Body: {  
  verificationToken, username, firstname, lastname, email, password  
}  

### /api/user/login  
Logs the user in. Will generate an authToken cookie.  
Method: POST  
Content-Type: application/json  
Body: {  
  email, password  
}  

### /api/user/logout  
Logs the user out by removing the authToken.  
Method: POST  
Content-Type: application/json  

### /api/user/update  
Updates the provided user info.  
Method: POST  
Content-Type: application/json  
Body: {  
  username, firstname, lastname, email, age, denomination, currentPassword, newPassword  
}  

### /api/user/forgotpassword/submit  
Submits a forgot password request. Emails the user a recoveryToken.  
Method: POST  
Content-Type: application/json  
Body: {  
  email  
}  

### /api/user/validrecoverytoken/:recoveryToken  
Checks the validity of the recoveryToken provided.  
Method: GET  
Content-Type: application/json  

### /api/user/resetpassword  
Resets the User's password.  
Method: POST  
Content-Type: application/json  
Body: {  
  recoveryToken, newPassword  
}  

### /api/user  
Deletes the user's account.  
Method: DELETE  
Content-Type: application/json  

### /api/user/:username  
Returns the target user's profile. Takes username as a parameter.  
Method: GET  
Content-Type: application/json  

### /api/user/changeavatar  
Changes the user's avatar. FormData should include a image file called 'avatar'.  
Method: POST  
Content-Type: multipart/form-data  
Body: {  
  FormData  
}  

### /api/user/changebanner  
Changes the user's banner. FormData should include a image file called 'banner'.  
Method: POST  
Content-Type: multipart/form-data  
Body: {  
  FormData  
}  

### /api/user/updatetogetherprofile  
Update the user's together profile information.  
Method: POST  
Content-Type: application/json  
Body: {  
  bio  
}  

## Session Routes  
The session routes contain the API necessary to perform CRUD operations on Guided Chat message sessions.  

### /api/session  
Retrieve all of the user's chat sessions.  
Method: GET  
Content-Type: application/json  

### /api/session/create  
Create a new Guided Chat Session.  
Method: POST  
Content-Type: application/json  

### /api/session/:sessionid  
Deletes the target session. Takes sessionid as a parameter.  
Method: DELETE  
Content-Type: application/json  

### /api/session  
Deletes all of the user's sessions.  
Method: DELETE  
Content-Type: application/json  

## Message Routes  
The message routes are used to get and add messages to and from a session.  

### /api/message/:sessionid  
Gets all of the messages in the targeted session. Takes sessionid as a parameter.  
Method: GET  
Content-Type: application/json  

### /api/message/add  
Adds a message to the targeted session.  
Method: POST  
Content-Type: application/json  
Body: {  
  sessionid, sender, text  
}  

## AI Routes  
The AI routes are used to interact with the OpenAI API.  

### /api/ai/completion  
Returns a completion from OpenAI API using the provided message. Passes the user's firstname, age, and denomination if applicable.  
Method: POST  
Content-Type: application/json  
Body: {  
  message, sessionid, firstname, age, denomination  
}  

### /api/ai/summary  
Creates a ~4 word summary based on the messages in the session.  
Method: POST  
Content-Type: application/json  
Body: {  
  sessionid  
}  

## Feedback Routes  
The feedback routes are used to create and read different types of feedback.  

### /api/feedback/all  
Retrieves all feedback. USER must be an AUTHENTICATED_ADMIN.  
Method: GET  
Content-Type: application/json  

### /api/feedback/  
Creates a new feedback post. If the user is signed in, stores userid.  
Method: POST  
Content-Type: application/json  
Body: {  
  feedback  
}  

### /api/feedback/bugreports  
Retrieves all bug reports. USER must be an AUTHENTICATED_ADMIN.  
Method: GET  
Content-Type: application/json  

### /api/feedback/bugreport  
Creates a new bug report.  
Method: POST  
Content-Type: application/json  
Body: {  
  category, impact, issue  
}  

## VOTD Routes  
VOTD Routes are used to obtain the verse of the day.  

### /api/verse/votd  
Retrieves the verse of the day.  
Method: GET  
Content-Type: application/json  
