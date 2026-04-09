# Academy CSIT Tracker (Firebase Edition)

A full-featured academic management portal built with Next.js and Firebase. This application tracks subjects, notes, assignments, exams, and syllabus progress.

## Technologies
- **Frontend**: Next.js (React 19, Tailwind CSS)
- **Backend**: Firebase (Firestore for data, Firebase Storage for files)

## Key Features
- **Syllabus Tracker**: Real-time progress monitoring for course modules.
- **Subject Management**: Organize courses by semester with custom themes.
- **Notes & Resources**: Upload and download study materials (PDF/Files).
- **Assignment Tracker**: Deadline countdowns and submission tracking.
- **Exam Routine**: Integrated calendar view for upcoming tests.
- **Localization**: Pre-integrated support for English and Nepali.
- **Premium UI**: Dark mode, glassmorphism, and responsive layouts.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Firebase**:
   Create a `.env.local` file in the `frontend/` directory with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   ... (see .env.local template)
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Firebase Services Used
- **Cloud Firestore**: Stores all JSON-like data (Subjects, Notes, etc.).
- **Firebase Storage**: Handles PDF and image uploads for notes and assignments.
