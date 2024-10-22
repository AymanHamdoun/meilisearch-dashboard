# Meilisearch Dashboard

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



### (Optional) Adding Pre-Push Hook
- ```touch .git/hooks/pre-push```
- ```chmod +x .git/hooks/pre-push```
- write pre push logic
    ``` bash
    #!/bin/bash
    
    # Run lint
    echo "Running linter..."
    npm run lint
    if [ $? -ne 0 ]; then
    echo "Linting failed. Push aborted."
    exit 1
    fi
    
    # Run tests
    echo "Running tests..."
    npm test
    if [ $? -ne 0 ]; then
    echo "Tests failed. Push aborted."
    exit 1
    fi
    
    echo "All checks passed. Proceeding with push."
    exit 0
    ```
