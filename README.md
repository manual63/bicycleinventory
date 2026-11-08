# Guideline for Shad

### TypeScript

Learn Typescript a bit deeper by exploring advanced types and patterns that are commonly used in large-scale applications.

- Mapped types **(In Progress)**
- Conditional types
- Record type
- Generics
- Utility types

### Advanced React

Focus on understanding advanced patterns and performance optimization techniques in React.

- Render props **(In Progress)**
- Custom Hooks **(In Progress)**
- How to use Context API effectively **(In Progress)**
- When and why to use controllers **(Done)**
- When and why to use a Class

### Material UI

Focus on understanding the core concepts of Material-UI and how to effectively use its components and theming system in your projects.

- Understand the core concepts of Material-UI (MUI) such as theming, styling, and component customization. **(In Progress)**
- Practice building reusable UI components using MUI. **(In Progress)**
- Learn how to integrate MUI with React hook forms for form handling.

### React Hook Forms

Improve your understanding of form handling in React by mastering React Hook Forms.

- Learn how to handle form state and validation using React Hook Forms.
- Understand the core concepts: `useForm`, `Controller`, and form context. **(In Progress)**
- Explore advanced patterns like dynamic fields and nested forms. **(In Progress)**
- Understand the lib hooks and how to use them effectively in forms.
  - useWatch **(Done)**
  - useFormState **(Done)**
  - useFormContext **(Done)**
  - useFieldArray **(Yeah I have no clue yet)**

### Zustand

Zustand is a small, fast, and scalable state management solution for React applications. It allows you to manage state outside of the component tree and provides a simple API for accessing and updating state.

- Understand the core concepts: store, actions, and selectors. **(Done)**
- Understand how to organize state, actions, and selectors effectively within a Zustand store. **(Done)**
- Better understand how to consume Zustand state and actions within TypeScript components. **(Done)**. 

## General Recommendations

**1. Practice deliberately, in small doses**

- Solve 2-3 problems a week on LeetCode, Exercism, or Codewars, focused on arrays, strings, maps/sets, and recursion. These match everyday front-end work.
- After each solution, compare it with the top-voted one and note what differed.

**2. Use a repeatable approach before coding**

- Restate the problem in your own words. Make drawing diagrams if necessary to visualize it and understand the relationships between different parts of the problem. **(In Progress)**
- Write down inputs, outputs, and edge cases (empty, null, duplicates, large input).
- Write the plan as comments or pseudocode, then implement.
- Test against the edge cases and refine.

**3. Break down real work tasks**

- Before starting a ticket, split it into small steps (data shape, API call, state, UI, edge cases) and write them in the PR or ticket.
- Ask "what is the simplest version that works?" first, then iterate.
  1. **Make it work**: get a basic version running that solves the problem. **(Done)**
  2. **Make it right**: refactor and improve code quality, readability, and maintainability. **(In Progress)**
  3. **Make it fast**: optimize performance and efficiency.

**4. Build things that stretch you**

- Reimplement small utilities (debounce, `Promise.all`, a simple store, a typed `pick`/`omit`) to understand their inner workings and reinforce TypeScript concepts.

**5. How do I keep up with current trends and advancements?**
