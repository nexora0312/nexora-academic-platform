# System Architecture

Campus360 uses Next.js App Router, Route Handlers, a server-side Prisma repository/service layer,
MySQL 8.4, and a responsive React frontend. Browser code communicates only through `/api/v1/`
endpoints; database access is never exported to the client.
