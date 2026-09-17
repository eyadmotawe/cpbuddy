import { Box, Button, Text } from "@chakra-ui/react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { executeCode } from "./api.js";

loader.config({ monaco });

// SolutionPanel: a reusable editor panel for one solution.
// `label`  — panel title ("Solution A" or "Brute Force").
// `stdin`  — test input produced by the generator, passed in from App.
// `output` — displayed output, owned by App so stress-loop updates are visible.
// `onOutput` — reports the latest stdout back up to App after each run.
const SolutionPanel = ({ label, code, language, onCodeChange, onLanguageChange, stdin, output, onOutput }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!code) return;
    setIsRunning(true);
    try {
      const { run: result } = await executeCode(language, code, stdin);
      // Report result to App — App owns the output state, so it flows back
      // down here as the `output` prop on the next render.
      onOutput(result.output || "");
    } catch (err) {
      console.error(`${label} error:`, err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box flex={1} p={3} border="1px solid" borderColor="#444" borderRadius={6}>
      <Text fontSize="xl" fontWeight="bold" mb={3}>{label}</Text>

      <LanguageSelector language={language} onSelect={onLanguageChange} />

      <Editor
        height="40vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(val) => onCodeChange(val || "")}
      />

      <Button
        mt={3}
        variant="outline"
        colorScheme="green"
        disabled={isRunning}
        onClick={handleRun}
      >
        {isRunning ? "Running..." : "Run"}
      </Button>

      {/* Output panel — updates on every manual run AND every stress-test iteration */}
      <Box mt={3}>
        <Text fontSize="sm" color="gray.400" mb={1}>Output:</Text>
        <Box
          p={2}
          bg="#1e1e1e"
          color="#d4d4d4"
          fontFamily="mono"
          fontSize="sm"
          borderRadius={4}
          border="1px solid"
          borderColor="#444"
          whiteSpace="pre-wrap"
          minH="4rem"
          maxH="20vh"
          overflowY="auto"
        >
          {output || <Text as="span" color="gray.600">No output yet — run the code or start the stress test.</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default SolutionPanel;
