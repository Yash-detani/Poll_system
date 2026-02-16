# **App Name**: Realtime Poll Platform

## Core Features:

- Poll Creation: Allow users to create polls with a question and multiple options, storing them in MongoDB and generating a unique shareable URL using nanoid.
- Real-time Voting and Results: Enable users to vote on polls and see real-time results updated via Socket.IO, with votes stored in MongoDB.
- Abuse Prevention: Implement IP-based vote restriction and localStorage vote lock to prevent voting abuse and ensure fair results. This includes usage of a 'tool' in the form of an IP tracking package to see if multiple votes come from one IP.
- Poll Persistence: Ensure that polls and votes persist in MongoDB, allowing users to refresh the page and maintain the poll state.
- Link Sharing: Enable users to share poll links, allowing anyone with the link to access the poll and vote.
- User Interface: Design a user-friendly interface for creating polls, voting, and viewing results, with loading and error states handled appropriately.

## Style Guidelines:

- Primary color: Vivid blue (#3498DB) for a clean and trustworthy feel.
- Background color: Light gray (#ECF0F1) for a neutral backdrop.
- Accent color: Soft green (#2ECC71) for positive feedback and vote confirmation.
- Body and headline font: 'Inter' for a modern, neutral, and readable design.
- Note: currently only Google Fonts are supported.
- Use simple, clear icons to represent different options and actions within the poll.
- Subtle animations when votes are cast and results are updated to provide visual feedback.