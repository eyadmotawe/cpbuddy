# cpbuddy

A competitive programming stress testing tool. It generates randomized test cases, feeds them into both your target solution and a brute-force solution, and flags the first mismatch with a line-by-line diff.

Code execution runs locally through a self-hosted [Piston](https://github.com/engineer-man/piston) engine running in Docker.

---

## Prerequisites

- **Node.js** (v18+)
- **Docker**

---

## Installation & Setup

### 1. Clone and install dependencies

```bash
git clone git@github.com:eyadmotawe/cpbuddy.git
cd cpbuddy
npm install
```

### 2. Start the local Piston engine

Run Piston in a Docker container on port `2000`:

```bash
docker run -d \
  -p 2000:2000 \
  --name piston \
  --privileged \
  -v /tmp/piston/packages:/piston/packages \
  ghcr.io/engineer-man/piston
```

### 3. Install language runtimes in Piston

Piston ships without language runtimes preinstalled. Install the runtimes you plan to use:

```bash
# Python
docker exec -it piston piston install python

# C++ (GCC)
docker exec -it piston piston install gcc

# JavaScript (Node.js)
docker exec -it piston piston install node
```

Verify installed runtimes:

```bash
docker exec -it piston piston list
```

### 4. Start the frontend

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## How to Use

1. **Generator**: Write generator code (e.g. Python) that prints a randomized test case to `stdout`.
2. **Solution A & Brute Force**: Paste your optimized solution in "Solution A" and your trusted, correct solution in "Brute Force".
3. **Manual Run**:
   - Click **Run Generator** to create a test case. The output appears in the generator's preview.
   - Click **Run** on either solution panel to run that specific test case through it.
4. **Stress Test**:
   - Set the number of tests ($N$).
   - Click **Run Stress Test**.
   - The app generates a new test case per iteration, runs both solutions, and stops on the first mismatch, rendering the failing input and line-by-line diff.

---

## Implementation Details

- **Frontend Core**: Built with React 19, Vite, Chakra UI v3, and Monaco Editor (`@monaco-editor/react`).
- **Dev Server Proxy**: `vite.config.js` proxies `/api` requests to `http://localhost:2000`, eliminating browser CORS issues when communicating with the local Docker container.
- **Code Execution API**: `src/components/api.js` wraps Piston's `/api/v2/execute` endpoint, submitting language, version, source code, and dynamic `stdin` input.
- **State Architecture**: Test input (`generatedInput`) and solution outputs (`outputA`, `outputB`) are lifted to `App.jsx`. This keeps single runs and automated loop updates synchronized across all panels.
- **Stress Loop**: Runs sequentially for up to $N$ iterations:
  1. Executes generator to capture fresh `stdin`.
  2. Runs both solutions concurrently using `Promise.all`.
  3. Compares outputs with `.trimEnd()` to ignore trailing newline discrepancies across languages.
  4. Halts on the first differing test case.
- **Diff Display**: In-house line comparison implemented with native array zipping and equality checks, avoiding heavy external diff libraries.

