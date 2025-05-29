# Build Tool Showcase

A small web application showcasing modern front-end development workflows using TypeScript, Webpack, Sass, ESLint, Prettier, and Jest.

## Project Overview

This project aims to solidify the understanding of modern front-end development workflows by creating a small web application. It includes features like a theme switcher, filtering, sorting, footer, and unit tests.

## Style implementation

utilized sass to ensure effective styling and also a way to modularize out styles for readability, performance and cross browser compatibility

## Setup and Run Instructions

1. **mkdir build-tool-showcase:**

   ```bash
   git init
   ```

2. **Install dependencies and configurations:**

   ```bash
   npm install to install the packages and the dependencies like webpack, jest and typescript
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash

   npm run build
   ```

5. **Linting:**

   ```bash
   npm run lint
   ```

6. **Formatting:**

   ```bash
   npm run format
   ```

 **Combined lint & format:**

   ```bash
   npm run check
   ```

   **Run unit tests:**

   ```bash
   npm run test
   ```

 **Run tests with coverage:**

   ```bash
   npm run test:coverage
   ```

## Explanation of Build Process

### Webpack

Webpack is used as the build tool. Separate configurations are provided for development and production:

- **Development**: `webpack.config.dev.js` - Uses webpack-dev-server for hot reloading and development server.
- **Production**: `webpack.config.prod.js` - Minifies CSS and JavaScript, and enables source maps for debugging.

### TypeScript

TypeScript is configured for type-safe development. The `tsconfig.json` file is set up to transpile TypeScript to JavaScript.

### Sass

Sass (SCSS) is used for styling. SCSS variables, mixins, and partials are utilized to maintain a clean and modular CSS structure.

### Linting and Formatting

- **ESLint**: Configured with a custom `.eslintrc.json` file, extending recommended settings and adding custom rules.
- **Prettier**: Integrated with ESLint for consistent code formatting.

### npm Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs ESLint to check for linting errors.
- `npm run format`: Formats the code using Prettier.
- `npm run check`: Runs both linting and formatting checks.
- `npm run test`: Runs unit tests using Jest.
- `npm run test:coverage`: Runs tests with coverage report.

### Testing Information

Unit tests are implemented using Jest. Tests cover significant functions and modules, ensuring good code coverage. Test files are located in the `tests` directory.

### Pre-commit Hook

A pre-commit hook is set up using Husky to run linting and formatting checks before each commit. This ensures code quality is maintained.

This README    provides an overview of the project, setup instructions, and details about the build process, linting rules, and testing strategy.
