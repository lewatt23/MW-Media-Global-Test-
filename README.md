# Next.js AI Image Generator

A simple web application built with Next.js and Shadcn UI that generates images based on user prompts, allows selection, download, and iterative style-based generation.

Deployed on Vercel: https://mwmedia.vercel.app/
GitHub Repository: https://github.com/lewatt23/MW-Media-Global-Test-

## Features

- **Text-to-Image Generation:** Enter a text prompt to generate 4 initial image variations.
- **Image Selection:** Click on any of the 4 generated images to select it as your favorite.
- **Download:** Download the selected image directly.
- **Style-Based Regeneration:** Generate 4 new images based on the _style_ of the currently selected image.
- **UI:** Clean interface built using Shadcn UI components.

## Tech Stack

- Next.js
- React
- TypeScript
- Shadcn UI
- Tailwind CSS
- OpenAI
- Vercel (for deployment)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm / yarn / pnpm
- An API key from OpenAI

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [Link to your GitHub repository]
    cd [your-project-directory-name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**

    - Place your OPENAI KEY in the `.env`.

    - **`.env` file contents:**
      ```plaintext
      OPENAI_API_KEY=your_api_key_
      ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
