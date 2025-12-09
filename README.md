# CareerRaah: AI-Powered Career Guidance Platform

This document outlines the features and architecture of the CareerRaah web application, serving as a blueprint for creating a corresponding native Android application.

## 1. Core Concept

CareerRaah is a platform that provides personalized, AI-driven career guidance for students and parents, primarily targeting the Indian market. It uses a detailed assessment to understand a user's profile and generates a comprehensive career strategy report, complete with roadmaps, skill suggestions, and resource recommendations.

---

## 2. Key Features & User Flows

### 2.1. User Onboarding & Role Selection

- **Entry Point**: The user journey begins on the `login` screen.
- **Role Selection**: Users must identify as either a **"Student"** or a **"Parent"**.
- **Name Input**: Users provide their full name (for students) or their child's full name (for parents).
- **Authentication**:
  - The primary flow allows users to proceed without mandatory login.
  - **Google Sign-In** is offered as an alternative authentication method using **Firebase Authentication**. This allows for a more personalized experience and potentially saving progress in future versions.
- **State Transition**: Upon continuing, the user is redirected to the assessment flow, passing their `role` and `name` as URL parameters.

### 2.2. Multi-Step Dynamic Assessment

This is the core data-gathering component of the application. The assessment is a multi-step form that dynamically adapts based on the user's selected academic stage.

- **Dynamic Flows**: The number and content of the steps change based on the user's `currentStage` value selected in Step 1.
  - **Youngest Students (e.g., Class 1-5)**: A simplified flow focused on personality and early development traits.
  - **Junior/Senior Students (e.g., Class 8-12)**: A comprehensive flow covering academics, interests, and goals.
  - **Graduates / Gap Year Students**: A flow tailored to job-seeking or further studies.

- **Data Points Collected**:
  - **Profile**: Academic Stage (`currentStage`), Education Board, Academic Stream.
  - **Academics**: Strong subjects, average academic score (input via a slider), and entrance exams they are preparing for.
  - **Interests**: Passions outside of academics (selected from a list with icons) and preferred work style.
  - **Goals & Constraints**: Annual college budget (input via a slider), location preference (e.g., Home Town, Metro City, Abroad), and a checkbox for parental pressure.
  - **Psychological Profile (for youngest students)**: Questions about the child's reaction to new situations, thinking style, and primary intelligence type.
  - **Open-Ended Questions**: A textarea for users to voice specific concerns or questions.

### 2.3. AI Career Report Generation

- **Trigger**: Upon completing the final step of the assessment, the collected form data is sent to a server-side AI flow.
- **AI Backend**: The application uses **Genkit** to orchestrate calls to the Google Gemini LLM.
- **Dynamic Prompts**: The `generate-career-report` flow uses conditional logic (Handlebars templating) to select a specific prompt persona and structure based on the user's role (`student` vs. `parent`) and academic stage. This ensures the tone and content of the report are highly contextual.
- **Report Display**:
  - A loading screen is displayed while the AI generates the report.
  - The generated report (in Markdown format) is rendered on the final step of the assessment screen.
  - A privacy notice informs the user that the report is not saved and should be downloaded.
- **Monetization/Unlocking**: The full report is initially blurred or truncated. Users are presented with plan options (e.g., a "Basic Plan" to unlock and download, a "Premium Plan" for additional features like expert chat) to view the complete content.

### 2.4. Interactive AI Chat

- **Feature**: After the report is generated, a chat interface appears, allowing users to ask follow-up questions.
- **Predefined Prompts**: A list of common follow-up questions is provided as buttons for user convenience (e.g., "Create a Year-by-Year Roadmap").
- **AI Backend**: User questions are sent to a separate Genkit flow (`answer-career-question`), which receives the original assessment data for context.
- **Conversational UI**: The chat history is displayed in a familiar user/bot format.

### 2.5. Career Explorer

- **Purpose**: A browsable database of modern and traditional careers, allowing parents and students to explore options outside the assessment.
- **UI**: A card-based layout that is filterable by `category` (e.g., Future Tech, Medical, Sports) and searchable by name.
- **Detailed View**: Clicking on a career card opens a modal dialog with detailed information presented in tabs:
  - **Money & ROI**: Displays expected salary range, financial risk, and a bar chart comparing average education cost to starting salary.
  - **Roadmap**: A step-by-step guide from school to the first job.
  - **Fit Check**: A checklist of questions to help users determine if the career aligns with their child's personality and skills.

### 2.6. Blog/Content Hub

- **Functionality**: A standard blog featuring articles on career guidance, education, and specific professions.
- **Homepage**: Features a curated list of popular or recent blog posts.
- **Blog Page**: Displays all posts with a search functionality to filter articles by keyword.
- **AI Summary**: Each blog post card has a "Summarize" button that triggers a Genkit AI flow (`summarize-blog-post`) to generate a one-sentence summary, displayed in a dialog.
- **Image Fallback**: Blog post cards have a robust image-handling mechanism. If an image fails to load, a fallback UI is rendered, showing the initials of the post title on a styled background. This ensures UI integrity.

---

## 3. Technical Architecture & Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI**: ShadCN UI components, Tailwind CSS
- **Styling**: `globals.css` contains the HSL color variables for theming. A dark theme is enabled by default.
- **Generative AI**: Genkit, leveraging Google Gemini models for report generation, chat, and summaries.
- **Authentication**: Firebase Authentication (Google Sign-In).
- **Internationalization (i18n)**: A `LanguageProvider` and `useTranslation` hook provide multi-language support (EN, HI, BN, TA, TE, MR). Translations are stored in `src/lib/translations.ts`.

This detailed breakdown should provide a solid foundation for designing the architecture and feature set of the CareerRaah Android application.
