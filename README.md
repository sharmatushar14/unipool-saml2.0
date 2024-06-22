# UniPool SAML SSO Integration

## Overview

This project showcases the integration of a Node.js application with SAML 2.0 Single Sign-On (SSO) using Okta as the Identity Provider (IDP) and Passport.js for managing authentication. The backend server is responsible for handling SSO requests, managing user sessions, and interacting with the Okta IDP for authentication and authorization. Additionally, the project includes a fully functional React.js frontend application designed to provide a seamless user experience for carpooling and real-time chat functionalities.

The backend leverages Express.js to set up the server, manage sessions, and define API routes for SSO operations such as login, callback handling, session verification, health checks, and logout processes. The integration with Okta ensures secure authentication using SAML 2.0, which is a widely adopted standard for secure web-based SSO.

On the frontend, the React.js application enables users to post and find carpooling ads, connect with other users, and engage in real-time chat conversations. The frontend is designed to work seamlessly with the backend, providing a smooth and user-friendly interface for all carpooling and communication needs.

## Key Features

- **Secure Authentication:** Utilizing SAML 2.0 with Okta for robust and secure user authentication.
- **Session Management:** Efficient session handling with Express-session and Passport.js.
- **Cross-Origin Resource Sharing (CORS):** Configured to allow secure cross-origin requests, essential for the frontend-backend communication.
- **Health Check:** Endpoint to monitor the status and health of the backend server.
- **Comprehensive Logout Process:** Proper session destruction and redirection after logout to ensure security.

This comprehensive setup ensures that the application is not only secure and scalable but also provides a rich feature set for carpooling and real-time communication.

