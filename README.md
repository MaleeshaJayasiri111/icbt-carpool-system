# Node.js + Express Backend

This project is a backend REST API developed using **Node.js**, **Express.js**, and **Supabase**.

Supabase is used for the database and authentication services.

> **Important:** Environment variables are stored inside a `.env` file. The `.env` file is not included in this repository for security reasons. Anyone cloning this project must create their own `.env` file before running the application.

## Technologies Used

* Node.js
* Express.js
* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage
* dotenv
* Postman for API testing

## Prerequisites

Before running the project, make sure you have installed:

* Node.js
* npm
* Git

You will also need access to a Supabase project.

## Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Move into the project directory:

```bash
cd <project-folder-name>
```

Install the required dependencies:

```bash
npm install
```

## Environment Variable Configuration

The project uses environment variables to connect to Supabase.

The actual `.env` file is **not pushed to GitHub** because it contains sensitive configuration information.

Create a new file named:

```text
.env
```

inside the root directory of the project.

Your project structure should look similar to:

```text
project-folder/
│
├── controllers/
├── middleware/
├── routes/
├── services/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

Add the required Supabase configuration to the `.env` file.

Example:

```env

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Getting Supabase Credentials

Open your Supabase project dashboard.

Go to:

```text
Project Settings → API
```

From there, copy the required values such as:

```text
Project URL
Anon/Public Key
Service Role Key
```

Then add them to your local `.env` file.

Example:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

Do **not** copy another developer's private `.env` file into GitHub.

Each developer should configure the required environment variables locally.

## Security Notice

Never push the `.env` file or private Supabase keys to GitHub.

Make sure `.env` is included inside `.gitignore`.

Example `.gitignore`:

```gitignore
node_modules/
.env
```

The **Supabase Service Role Key is especially sensitive** because it can bypass Row Level Security policies. It must never be exposed publicly or used in frontend/client-side code.

## Optional `.env.example`

For easier project setup, the repository can include a `.env.example` file.

Unlike `.env`, this file contains only variable names and does not contain real credentials.

Example:

```env

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

A new developer can then copy it:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then they can add their own Supabase credentials.

## Running the Application

After installing the dependencies and configuring the `.env` file, start the backend server.

If the project is started directly using Node.js:

```bash
node server.js
```

If a start script is configured in `package.json`:

```bash
npm start
```

For development with Nodemon, if configured:

```bash
npm run dev
```

The backend should then run on the configured port.

For example:

```text
http://localhost:5000
```

## API Testing

The API endpoints can be tested using **Postman**.

For protected routes, obtain the authentication token after logging in and include it in the request header:

```http
Authorization: Bearer <access_token>
```

Also make sure the request uses the appropriate content type when sending JSON:

```http
Content-Type: application/json
```

## Important Files

```text
server.js
```

Main entry point of the backend application.

```text
routes/
```

Contains the Express API routes.

```text
controllers/
```

Contains the application logic for handling API requests.

```text
middleware/
```

Contains authentication and role-based middleware.

```text
.env
```

Contains local environment configuration and Supabase credentials. This file is not committed to GitHub.

```text
.env.example
```

Shows which environment variables are required without exposing sensitive credentials.

## Troubleshooting

### Supabase connection errors

Check that:

* The `.env` file exists in the root directory.
* The Supabase URL is correct.
* The Supabase API key is correct.
* Environment variable names match the names used in the source code.
* `dotenv` is loaded before environment variables are accessed.

Example:

```javascript
require("dotenv").config();
```

### Dependencies missing

Run:

```bash
npm install
```

### Environment variables return `undefined`

Check that the variable names are written correctly.

For example:

```env
SUPABASE_URL=...
```

must match:

```javascript
process.env.SUPABASE_URL
```

Restart the Node.js server after making changes to `.env`.

## Important for Contributors

After cloning this repository:

1. Run `npm install`.
2. Create a `.env` file.
3. Add the required Supabase credentials.
4. Make sure the required Supabase database tables and storage buckets exist.
5. Start the backend using `node server.js` or the configured npm script.
6. Test the APIs using Postman.

The `.env` file must remain local and must **never be committed to GitHub**.



# Supabase Database Setup

To set up the database for this project:

1. Create a new project in **Supabase**.
2. Open the **SQL Editor** in your Supabase project.
3. In this backend project, open:

```text
backend/schema/schema.sql
```

4. Copy all the SQL code from the `schema.sql` file.
5. Paste it into the Supabase **SQL Editor**.
6. Click **Run** to execute the SQL.

This will create the required database tables and related database structure for the backend application.

After the SQL script runs successfully, configure the Supabase project URL and API keys in your local `.env` file.

You can give the Supabase project itself any name they want. The project name does not affect your backend connection.

Run your backend/schema/schema.sql script without changing the required table/column names.
Put their own new Supabase Project URL and API keys into the .env file.
Keep the .env variable names exactly the same as your code expects, such as SUPABASE_URL and SUPABASE_ANON_KEY.
