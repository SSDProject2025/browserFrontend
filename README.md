# browserFrontend
A frontend web application for managing video game collections, built with **SvelteKit**.

> ⚠️ **Development Note**
>
> The backend for this application is not yet implemented. This codebase currently uses **mock data** to test the User Interface (UI) and navigation flows. All data displayed is simulated and changes will not persist.

## ✨ Features

* **Feed:** Discover new games on the homepage.
* **User Accounts:** Interface for login and registration.
* **Profile Management:** View and manage user details.
* **Game Collections:** Organize games into "To Play" and "Played" lists.

## 🛠️ Tech Stack

* **Framework:** [SvelteKit](https://kit.svelte.dev/)
* **Language:** TypeScript
* **Styling:** CSS / TailwindCSS
* **Package Manager:** npm

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (Version 18+ recommended)
* npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SSDProject2025/browserFrontend
    cd browserFrontend/fiordispino-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **View the app**
    Open your browser and navigate to `http://localhost:5173`.

---

## 🗺️ Routes

Here is the current navigation structure of the application:

* **`/`** - Homepage: feed (Public)
* **`/auth`** - Login and registration (Public)
* **`/profile`** - User profile (🔒 Authentication required)
    * **`/collections/to-play`** - Collection of games to play
    * **`/collections/played`** - Collection of played games

---

## 🧪 Working with Mock Data

Since the backend is unavailable, the application fetches data from local mock files.

* **Mock data:** you can find mock data on every page that uses it.
* **Behavior:** The app simulates API calls using `setTimeout` to mimic network latency in some components.

## 📦 Building for Production

To create an optimized version of the app:

```bash
npm run build
