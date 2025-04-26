# FARS 2023 Analysis

This project is a web application designed to analyze and visualize data from the Fatality Analysis Reporting System (FARS) for the years 2016-2023. The application provides insights into crash statistics, trends, and correlations using interactive components and visualizations.

## Features

- **Quick Statistics**: Overview of key metrics such as total crashes, most dangerous times, and affected states.
- **Crash Timeline**: Visual representation of crash trends over time.
- **Data Explorer**: Interactive tool to explore crash data by various dimensions.
- **Weather Correlation**: Analysis of weather conditions and their impact on crashes.
- **City Scorecard**: Detailed crash statistics for specific cities.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) for server-side rendering and routing.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**: Custom components built with [Radix UI](https://www.radix-ui.com/) primitives.
- **Icons**: [Lucide React](https://lucide.dev/) for modern and customizable icons.
- **State Management**: React hooks for managing application state.
- **Animations**: Scroll-based animations using custom `ScrollReveal` component.

## Folder Structure

- **`components/`**: Contains reusable UI components and feature-specific components.
  - **`ui/`**: Shared UI components like buttons, cards, modals, etc.
  - Feature-specific components like `quick-stats.tsx`, `crash-timeline.tsx`, etc.
- **`hooks/`**: Custom React hooks for data fetching and state management.
- **`lib/`**: Utility functions used across the application.
- **`public/`**: Static assets like images and icons.
- **`styles/`**: Global CSS and Tailwind configuration.
- **`app/`**: Next.js app directory for routing and layout.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd fars-2023-analysis
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open the application in your browser at `http://localhost:3000`.

## Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the application for production.
- `pnpm start`: Start the production server.
- `pnpm lint`: Run linting checks.

## Dependencies

Key dependencies used in this project:

- `@radix-ui/react-*`: Radix UI primitives for accessible components.
- `lucide-react`: Icon library for React.
- `tailwindcss`: Utility-first CSS framework.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [FARS](https://www.nhtsa.gov/research-data/fatality-analysis-reporting-system) for providing the crash data.
- [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for powering the application.
- [Radix UI](https://www.radix-ui.com/) for accessible and customizable UI components.
