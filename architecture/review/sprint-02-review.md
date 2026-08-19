Problem:

Multiple API replicas must recognize an authenticated user.

Solution:

JWT.

--------------------------------------------------

Authentication:

Who are you?

--------------------------------------------------

Authorization:

What are you allowed to do?

--------------------------------------------------

Stateful:

Session stored on the server.

--------------------------------------------------

Stateless:

JWT stored on the client.

--------------------------------------------------

BCrypt:

Protect passwords.

--------------------------------------------------

JWT:

Carry identity between API replicas.


Quiz
A user logs in through API #1.

The next request is routed to API #3.

How does API #3 know who the user is?

Answer:

The client sends the JWT with every request.
