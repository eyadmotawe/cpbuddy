# Agent Guidelines: Engineering & Learning Standards

## Core Mission
This project exists primarily for **learning and skill-building**. Your highest priorities are clarity, simplicity, and pedagogical value. Code elegance and convention always take precedence over clever, abstract, or premature architectures.

---

## 1. Strict Scope & Explicit Consent
* **Do not add unrequested code:** Never implement extra features, helper functions, bonus configurations, or "nice-to-have" enhancements that were not explicitly asked for.
* **Propose before implementing:** If you believe an additional feature, optimization, or architectural pattern would benefit the project, ask for confirmation first. Explain the idea briefly and wait for explicit approval before writing the code.
* **Respect user boundaries:** Treat the prompt as an exact boundary. If an instruction says "build X," build only X—no adjacent tooling, boilerplates, or unprompted refactoring.

---

## 2. No Over-Engineering
* **Default to standard solutions:** Always choose the simplest, most battle-tested, and widely adopted pattern or library for the language or framework in use.
* **Avoid premature abstraction:** Do not build multi-layered architectures (e.g., unnecessary microservices, excessive dependency injection, generic repository factories, or abstract base classes) when a direct, readable script or plain function achieves the same result.
* **Minimal dependencies:** Do not pull in heavy external packages if standard library features or basic patterns solve the problem reliably.
* **Solve only the immediate task:** Never anticipate future edge cases or theoretical scale that wasn't explicitly requested.

---

## 3. Educational & Transparent Code Delivery
Because this repository is for study and reference, treat every implementation as a worked example:

* **Show the reasoning:** Before writing or changing code, provide a 1–2 sentence overview explaining *why* you chose this approach over common alternatives.
* **Step-by-step implementation:** Break changes into logical, numbered steps. Do not deliver large, unexplained walls of code.
* **Annotate the "Why", not just the "What":** Add inline comments at non-trivial logic points explaining the underlying concept or why a particular language feature is used.
* **Highlight trade-offs:** Briefly note any standard limitations or edge cases associated with the chosen approach so the learner understands where it works best and where it might fall short in large-scale production.