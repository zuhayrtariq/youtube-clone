# Zee-Tube - Your Modern YouTube Clone

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logoColor=white)](https://ui.shadcn.com/)
[![Mux](https://img.shields.io/badge/Mux-000000?style=for-the-badge&logoColor=white)](https://mux.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
**Zee-Tube** is a modern and responsive YouTube clone built using cutting-edge technologies. It leverages the power of Next.js for server-side rendering and routing, the elegant and accessible UI components from Shadcn UI, and the robust video streaming capabilities of Mux.

## Features

* **Browse Videos:** Explore a collection of videos with a clean and intuitive interface.
* **Watch Videos:** Enjoy seamless video playback powered by Mux.
* **User Authentication (Optional):** Implement user accounts for features like liking, commenting, and subscribing (this can be a future enhancement).
* **Responsive Design:** Looks and works great on all devices, from desktops to mobile phones.
* **Modern UI:** Utilizes the beautiful and accessible components from Shadcn UI.
* **Optimized Performance:** Built with Next.js for excellent performance and SEO.
* **Scalable Architecture:** Designed with a modular structure for easy expansion.

## Technologies Used

* **[Next.js](https://nextjs.org/):** The React framework for production.
* **[React](https://react.dev/):** A JavaScript library for building user interfaces.
* **[Shadcn UI](https://ui.shadcn.com/):** A collection of reusable UI components built using Radix UI and Tailwind CSS.
* **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
* **[Mux](https://mux.com/):** An API-first platform for video streaming.
* **[TypeScript](https://www.typescriptlang.org/):** A statically typed superset of JavaScript (optional, but highly recommended).
* **[Prisma](https://www.prisma.io/) / [Other ORM/Database] (Optional):** For database interactions if implementing user features.
* **[Clerk](https://clerk.com/) / [NextAuth.js](https://next-auth.js.org/) (Optional):** For user authentication if implemented.

## Getting Started

Follow these steps to get Zee-Tube up and running on your local machine.

### Prerequisites

* **Node.js:** Make sure you have Node.js (version 18 or later recommended) installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
* **npm** or **yarn** or **pnpm:** You'll need a package manager. npm comes with Node.js, or you can install yarn from [yarnpkg.com](https://yarnpkg.com/) or pnpm from [pnpm.io](https://pnpm.io/).
* **Mux Account:** You'll need a Mux account to stream videos. Sign up at [mux.com](https://mux.com/) and obtain your API credentials.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/zuhayrtariq/zee-tube.git](https://github.com/zuhayrtariq/zee-tube.git)
    cd zee-tube
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Using yarn:
    ```bash
    yarn install
    ```
    Using pnpm:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the following environment variables:

    ```
    MUX_PRIVATE_KEY=YOUR_MUX_PRIVATE_KEY
    MUX_PUBLIC_KEY=YOUR_MUX_PUBLIC_KEY
    # Add other environment variables as needed (e.g., database connection string)
    ```

    *(Replace `YOUR_MUX_PRIVATE_KEY` and `YOUR_MUX_PUBLIC_KEY` with your actual Mux API credentials.)*

4.  **Run the development server:**
    Using npm:
    ```bash
    npm run dev
    ```
    Using yarn:
    ```bash
    yarn dev
    ```
    Using pnpm:
    ```bash
    pnpm dev
    ```

    Open your browser and navigate to `http://localhost:3000` to see Zee-Tube in action.

## Deployment

You can deploy your Zee-Tube application to various platforms that support Next.js, such as:

* **Vercel:** [vercel.com](https://vercel.com/) (Recommended for Next.js projects)
* **Netlify:** [netlify.com](https://www.netlify.com/)
* **Render:** [render.com](https://render.com/)
* **AWS Amplify:** [aws.amazon.com/amplify/hosting/](https://aws.amazon.com/amplify/hosting/)

Follow the deployment instructions provided by your chosen platform, ensuring that you configure the necessary environment variables.

## Contributing

Contributions are welcome! If you'd like to contribute to Zee-Tube, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request detailing your changes.


## Acknowledgements

* [Next.js](https://nextjs.org/) for providing an excellent React framework.
* [Shadcn UI](https://ui.shadcn.com/) for the beautiful and accessible UI components.
* [Mux](https://mux.com/) for the reliable and powerful video streaming platform.
* [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
* And to the open-source community for their invaluable contributions.


**Thank you for checking out Zee-Tube!** If you have any questions or suggestions, feel free to open an issue.
