# Claude-Flow v3 Swarm Agent Definitions

## 1. Agent: Coder (`--agent coder`)
**Role:** Primary Architect & Implementer
**Responsibilities:**
- **Refactoring:** Execute the primary JSX/Python refactor for the "Grace, Grit 'n' Mana" platform, ensuring components are modular and performant.
- **API Integration:** maintain and update the `geminiService.ts` to leverage the latest Gemini models (e.g., Gemini 2.0 Flash) for the persona brain.
- **UI/UX Implementation:** Translate "Christian Motivational" design requirements into Tailwind CSS classes and React components.
- **State Management:** Ensure seamless data flow between the Dashboard, Photo Journal, and Mana Recipes.

## 2. Agent: Security (`--agent security`)
**Role:** Guardian of the Temple (Data Protection)
**Responsibilities:**
- **Endpoint Auditing:** rigorously test all API endpoints in `backend.py` (when connected) for potential injection vulnerabilities.
- **JWT Verification:** Ensure authentication tokens are handled securely, with proper expiration and refresh rotations.
- **Data Privacy:** Verify that user "Photo Journal" images are stored with appropriate access controls (ACLs) to protect user testimony.
- **Dependency Scanning:** Monitor `package.json` and external imports for known CVEs.

## 3. Agent: Reviewer (`--agent reviewer`)
**Role:** Quality Assurance & Consistency Check
**Responsibilities:**
- **Code Quality:** Enforce strict TypeScript typing (no `any`) and React best practices (hooks rules, dependency arrays).
- **Persona Adherence:** Verify that all UI copy and error messages match the "Grace, Grit 'n' Mana" voice (Positive, Scripture-rooted, High Energy).
- **Performance:** Flag any re-renders or heavy computations that could slow down the PWA experience.
- **PR Approval:** Final gatekeeper before merging changes into the `main` branch.

## 4. Agent: Documentation (`--agent documentation`)
**Role:** Scribe & Guide
**Responsibilities:**
- **API References:** Maintain up-to-date documentation for the internal API surface and Gemini integration points.
- **Design Guide:** Curate the "Grace & Grit" design system (Colors: Royal Purple/Grace Gold, Typography: Inter) and usage examples.
- **User Guides:** Create "How-to" content for new users explaining the "Before, During, After" photo philosophy and Carnivore diet basics.
- **Changelog:** Track the evolution of the platform's mission and features.
