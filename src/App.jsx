import { useState } from "react";
import { Box, HStack, Text, Input, Button, Badge } from "@chakra-ui/react";
import GeneratorPanel from "./components/GeneratorPanel";
import SolutionPanel from "./components/SolutionPanel";
import DiffPanel from "./components/DiffPanel";
import { executeCode } from "./components/api.js";

function App() {
  // ── Generator state ──────────────────────────────────────────────
  const [genCode, setGenCode] = useState(
    "# Write your test-case generator here.\n# Example: print a random integer.\nimport random\nprint(random.randint(1, 100))"
  );
  const [genLang, setGenLang] = useState("python");
  // Holds the last output produced by the generator (becomes stdin for both solutions)
  const [generatedInput, setGeneratedInput] = useState("");

  // ── Solution A state ─────────────────────────────────────────────
  const [codeA, setCodeA] = useState("# Solution A\n");
  const [langA, setLangA] = useState("python");
  const [outputA, setOutputA] = useState("");

  // ── Brute Force state ────────────────────────────────────────────
  const [codeB, setCodeB] = useState("# Brute Force\n");
  const [langB, setLangB] = useState("python");
  const [outputB, setOutputB] = useState("");

  // ── Stress test state ────────────────────────────────────────────
  const [stressN, setStressN] = useState(10);
  const [stressRunning, setStressRunning] = useState(false);
  // Tracks which iteration is currently executing (shown in the button label)
  const [stressProgress, setStressProgress] = useState(0);
  // null = not yet run; object = result of last stress run
  const [stressResult, setStressResult] = useState(null);

  // Called by GeneratorPanel after a manual single run.
  // Clear old solution outputs so the diff doesn't show stale data.
  const handleGenerated = (input) => {
    setGeneratedInput(input);
    setOutputA("");
    setOutputB("");
  };

  // ── Stress test loop ─────────────────────────────────────────────
  // Runs up to N iterations.
  // Each iteration: generate fresh input → run both solutions in parallel → compare.
  // Outputs are updated every iteration so the user can see the live last-run result.
  // Stops immediately on the first mismatch and surfaces the failing test case.
  const runStressTest = async () => {
    setStressRunning(true);
    setStressResult(null);
    setStressProgress(0);

    for (let i = 1; i <= stressN; i++) {
      // Show which test we're currently on
      setStressProgress(i);

      // 1. Run the generator to produce a fresh test input for this iteration
      const genRes = await executeCode(genLang, genCode);
      const stdin = genRes.run.output || "";

      // 2. Run both solutions with that stdin simultaneously
      const [resA, resB] = await Promise.all([
        executeCode(langA, codeA, stdin),
        executeCode(langB, codeB, stdin),
      ]);

      const outA = resA.run.output || "";
      const outB = resB.run.output || "";

      // 3. Always surface the latest test's data so the DiffPanel stays live
      setGeneratedInput(stdin);
      setOutputA(outA);
      setOutputB(outB);

      // 4. Compare — trim trailing whitespace so a lone trailing newline
      //    doesn't cause a false mismatch between languages.
      if (outA.trimEnd() !== outB.trimEnd()) {
        // Mismatch found — stop and keep the failing test visible in the diff
        setStressResult({ passed: i - 1, total: stressN, failed: true });
        setStressRunning(false);
        return;
      }
    }

    // All N tests passed
    setStressResult({ passed: stressN, total: stressN, failed: false });
    setStressRunning(false);
  };

  return (
    <Box p={6} minH="100vh" bg="#0d0d0d" color="#d4d4d4">

      {/* ── 1. Generator ── */}
      <GeneratorPanel
        code={genCode}
        language={genLang}
        onCodeChange={setGenCode}
        onLanguageChange={setGenLang}
        generatedInput={generatedInput}
        onGenerated={handleGenerated}
      />

      {/* ── 2. Two solution editors side by side ── */}
      <HStack align="start" gap={4} mb={6}>
        <SolutionPanel
          label="Solution A"
          code={codeA}
          language={langA}
          onCodeChange={setCodeA}
          onLanguageChange={setLangA}
          stdin={generatedInput}
          output={outputA}
          onOutput={setOutputA}
        />
        <SolutionPanel
          label="Brute Force"
          code={codeB}
          language={langB}
          onCodeChange={setCodeB}
          onLanguageChange={setLangB}
          stdin={generatedInput}
          output={outputB}
          onOutput={setOutputB}
        />
      </HStack>

      {/* ── 3. Diff (only appears once either solution has produced output) ── */}
      <DiffPanel outputA={outputA} outputB={outputB} />

      {/* ── 4. Stress test controls ── */}
      <Box mt={6} p={4} border="1px solid" borderColor="#555" borderRadius={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Stress Test</Text>

        <HStack mb={4} gap={4}>
          <Text whiteSpace="nowrap">Number of tests (N):</Text>
          <Input
            type="number"
            value={stressN}
            onChange={(e) => setStressN(Math.max(1, Number(e.target.value)))}
            w="90px"
            min={1}
            max={1000}
          />
          <Button
            colorScheme="orange"
            variant="outline"
            disabled={stressRunning}
            onClick={runStressTest}
          >
            {stressRunning
              ? `Running test ${stressProgress} / ${stressN}...`
              : "Run Stress Test"}
          </Button>
        </HStack>

        {/* Stress test result badge */}
        {stressResult && (
          stressResult.failed ? (
            <Box>
              <Badge colorScheme="red" fontSize="sm" px={3} py={1}>
                ❌ Mismatch found after {stressResult.passed} passed test(s) — see diff above
              </Badge>
            </Box>
          ) : (
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              ✅ All {stressResult.total} tests passed
            </Badge>
          )
        )}
      </Box>
    </Box>
  );
}

export default App;
