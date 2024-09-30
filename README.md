# Artanova

## Description

Artanova is a web application that allows users to explore and discover artworks from various sources. The platform provides an immersive experience for art lovers to search, filter, and manage collections, while
ensuring accessibility and responsiveness across different devices. The project follows modern web standards, making use of a robust tech stack for seamless performance.

The main goal of Artanova is to curate virtual art exhibitions, offering users the ability to create personalized art collections, share them with others, and discover new works of art from both renowned and emerging
artists.

## Features

- **Search and filter artworks**: Allows users to explore various artworks based on criteria such as artist, genre, medium, and more.
- **Create personal collections**: Users can organize their favorite artworks into collections and manage them easily.
- **Share collections**: Personalized collections can be shared with others, either publicly or privately.
- **User authentication**: Secure account creation and login functionality, allowing users to save and manage their collections across sessions.
- **Accessibility-first design**: The app ensures that all features are accessible to users with disabilities, supporting keyboard navigation and screen readers.
- **Responsive design**: Optimized for seamless use on desktops, tablets, and mobile devices.
- **High-performance with smooth transitions**: Visual transitions and animations are designed to be smooth and non-intrusive, focusing on the user's experience.

## Technologies

- **TypeScript**: Ensures strong typing and scalability in JavaScript code.
- **React**: Frontend library for building interactive UIs.
- **Redux Toolkit**: For efficient global state management and easier handling of complex state logic.
- **React Router**: Used for routing and managing navigation between different pages within the single-page application.
- **Axios**: A promise-based HTTP client for making API requests to the backend.
- **Framer Motion**: Used for adding smooth animations and transitions to enhance user experience.
- **Lodash**: A utility library providing helpful functions for manipulating arrays, objects, and other data structures.
- **Swiper**: A modern library for implementing touch sliders and carousels, improving mobile and touch-screen interactions.
- **React Transition Group**: For handling complex UI transitions and animations with React components.
- **React Masonry CSS**: Used for creating responsive, Pinterest-like grid layouts for displaying artworks.
- **Phosphor Icons**: A flexible icon library for adding visually consistent icons across the application.
- **Tailwind CSS**: Utility-first CSS framework for custom styling and responsive design.
- **Vite**: A fast build tool for modern frontend development, enabling hot module replacement for a better development experience.

## Project Structure

The project is structured as a single-page application (SPA), where the frontend dynamically renders content without reloading the page. It uses the React component model, ensuring that the application is modular,
maintainable, and easy to scale.

- **Components**: All UI components are designed to be reusable and follow accessibility standards.
- **State Management**: The app uses **Redux Toolkit** for global state management, allowing centralized control of application state and making it easy to scale as the application grows.
- **Routing**: **React Router** is used to manage navigation within the app, ensuring smooth page transitions.
- **Animations**: **Framer Motion** and **React Transition Group** handle smooth transitions and animations for an enhanced user experience.
- **Grid Layouts**: **React Masonry CSS** is used to create a responsive grid layout for displaying artworks.

## How to run

1. Install requirements:
    - Node.js v21

2. Clone the repository:
    ```sh
    git clone https://github.com/Flammans/artanova.git
    cd artanova
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in the root of the project with the following variables:
      ```sh
      VITE_API_URL=<backend-api-url> # URL for the backend API
      VITE_API_KEY=<your-api-key>    # Optional: If your project requires an API key for third-party services
      VITE_PORT=<frontend-port>      # Optional: If you want to specify a different port for the frontend
      ```
    - Replace the placeholders with actual values as needed for your environment.

5. Start the development server:
    ```sh
    npm run dev
    ```

6. Open your browser and navigate to the link provided in the terminal.

## Accessibility

Artanova is built with accessibility in mind, following the Web Content Accessibility Guidelines (WCAG). Key accessibility features include:

- **Keyboard navigation**: All interactive elements are focusable and navigable via keyboard.
- **ARIA roles and properties**: These are implemented throughout the app to provide context to screen readers.
- **Responsive font sizes**: The app adjusts typography based on screen size and user preferences.
