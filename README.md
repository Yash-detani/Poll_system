# QuickVote

This is a full-stack web application that allows users to create polls, share them with a unique link, vote, and see results update in real-time. It's built with Next.js, MongoDB, and Socket.IO, and is designed to be production-ready.

## Demo

![Poll Creation](https://raw.githubusercontent.com/example/repo/main/screenshots/creation.png)
_Note: Demo screenshots are illustrative._

![Poll Voting](https://raw.githubusercontent.com/example/repo/main/screenshots/voting.png)

## Features

- **Poll Creation**: Simple interface to create a poll with a question and multiple options.
- **Unique Shareable Links**: Each poll gets a unique, short URL powered by `nanoid`.
- **Real-Time Results**: Votes are reflected instantly for all connected users without needing a page refresh, thanks to Socket.IO.
- **Single Vote per User**: Fairness is enforced through two primary mechanisms to prevent vote spamming.
- **Persistence**: All polls and votes are securely stored in a MongoDB database.
- **Responsive Design**: The interface is optimized for both desktop and mobile devices.

---

## Tech Stack & Architecture

- **Frontend**: Next.js with React (App Router) & TypeScript.
- **Backend**: Next.js API Routes (Pages Router for Socket.IO compatibility).
- **Database**: MongoDB with Mongoose for data modeling and persistence.
- **Real-Time Engine**: Socket.IO for instant, bidirectional communication.
- **Styling**: Tailwind CSS with shadcn/ui components for a modern, accessible UI.
- **Deployment**: Designed for Vercel, with a critical note on WebSocket support (see Deployment Guide).

The application uses a hybrid Next.js setup. The frontend is built using the modern **App Router** for its benefits in server components and layout management. The backend API, including the WebSocket handler, is built using the **Pages Router** (`/pages/api`) because it provides the necessary access to the underlying Node.js HTTP server, which is required for Socket.IO to function correctly in a non-custom server environment.

---

## Anti-Abuse Mechanisms

To ensure the integrity of poll results, two layers of vote restriction have been implemented:

1.  **IP-Based Restriction**:
    - **How it works**: A separate `Votes` collection in MongoDB stores a record of each `pollId` and the voter's IP address. A unique compound index on `(pollId, ip)` prevents more than one vote from the same IP address for a given poll at the database level.
    - **What it prevents**: A single user attempting to vote multiple times from the same network/device by clearing their browser data or using different browsers.
    - **Limitations**: This can be bypassed using VPNs or proxy servers. It may also unfairly block multiple distinct users on a shared network (like a university or corporate office) from voting.

2.  **`localStorage` Vote Lock**:
    - **How it works**: After a user successfully votes, a flag is set in their browser's `localStorage`. The frontend checks for this flag on page load and disables the voting interface if it's present.
    - **What it prevents**: A casual user from accidentally or intentionally voting more than once from the same browser.
    - **Limitations**: This is a client-side restriction and can be easily bypassed by clearing browser data, using a different browser, or using incognito mode. It's a UX enhancement rather than a robust security measure.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB Atlas account (or a local MongoDB instance)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/quickvote.git
    cd quickvote
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root of the project and add your MongoDB connection string.

    ```
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

## Deployment Guide (Vercel)

This application is designed to be deployed on Vercel.

1.  **Import Project**: Import your Git repository into Vercel. The framework preset should be automatically detected as Next.js.

2.  **Configure Environment Variables**: In the project settings on Vercel, add the `MONGODB_URI` environment variable with the same value from your `.env.local` file.

3.  **Deploy**: Let Vercel build and deploy the application.

### **IMPORTANT: WebSocket Support on Vercel**

The real-time functionality of this application relies on Socket.IO, which uses WebSockets. Vercel's primary serverless environment does **not support** stateful, long-running WebSocket connections.

-   **What this means**: During development (`npm run dev`), the real-time features will work perfectly. However, on a standard Vercel serverless deployment, **the real-time updates will not function**. Clients will not be able to establish a persistent WebSocket connection.

-   **Solutions**:
    1.  **Use a Vercel-friendly service**: For a production-ready real-time app on Vercel, replace Socket.IO with a service like [Pusher](https://pusher.com/) or [Ably](https://ably.com/), which are designed for serverless environments.
    2.  **Deploy to a different host**: Deploy the application to a platform that supports long-running Node.js servers, such as [Railway](https://railway.app/), [Fly.io](https://fly.io/), or a traditional VPS. The current code will work on these platforms without changes.

This project uses the Pages Router API for Socket.IO as a demonstration of how it would be integrated into a standard Node.js environment, which is the most common self-hosted setup for Next.js + Socket.IO.
