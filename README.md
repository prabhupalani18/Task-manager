# Task-manager app

This is a task manager app developed using Node.js and MongoDB. It allows users to create, manage, and organize their tasks effectively. The app is hosted on the Render website.

## Features

- User authentication: Users can create an account or log in to an existing account.
- Task management: Users can create new tasks, update existing tasks, mark tasks as complete, and delete tasks.
- Task categorization: Users can assign categories or tags to their tasks for better organization.
- Task filtering: Users can filter tasks based on categories, status, or search keywords.
- User profile: Users can view and update their profile information.
- User authorization: Only authenticated users can access and manage their tasks.

## Technologies Used

- Node.js: A JavaScript runtime environment for server-side development.
- Express.js: A web application framework for Node.js.
- MongoDB: A NoSQL database for storing task and user information.
- Render: A hosting platform for deploying and managing web applications.

## Installation

1. Clone the repository:
    ```sh
   git clone https://github.com/your-username/task-manager-app.git
    ```

2. Install the dependencies:
   ```sh
   cd task-manager-app
   npm install
   ```

3. Set up the MongoDB connection:

   - Create a MongoDB Atlas account or set up a local MongoDB instance.
   - Update the database connection URL in the `config/database.js` file.

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables:

     ```
     PORT=3000
     DATABASE_URL=your-mongodb-connection-url
     SESSION_SECRET=your-session-secret
     ```

5. Run the application:
   ```sh
   npm start
   ```
The app should now be running locally on `http://localhost:3000`.

## Deployment

To deploy the app on Render:

1. Sign up for a Render account at [https://render.com/](https://render.com/).

2. Create a new web service and connect your GitHub repository.

3. Configure the environment variables under the "Environment" settings:

   - `PORT`: Set it to `3000` or any other desired port.
   - `DATABASE_URL`: Set it to your MongoDB connection URL.
   - `SESSION_SECRET`: Set it to a secure session secret.

4. Deploy the app and wait for the deployment to complete.

5. Access your deployed app at the provided Render URL.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please submit an issue or open a pull request on the GitHub repository.
