import { Box, Button, Text, Textarea } from "@chakra-ui/react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { executeCode } from "./api.js";

loader.config({ monaco });

// GeneratorPanel: holds the generator program.
// `generatedInput` is owned by App so the stress loop can update it each iteration.
// `onGenerated` bubbles the fresh stdin up to App after a manual run.
const GeneratorPanel = ({ code, language, onCodeChange, onLanguageChange, generatedInput, onGenerated }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!code) return;
    setIsRunning(true);
    try {
      const { run: result } = await executeCode(language, code);
      const output = result.output || "";
      // Bubble up to App — App owns generatedInput, so it flows back here as a prop
      onGenerated(output);
    } catch (err) {
      console.error("Generator error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box mb={6} p={4} border="1px solid" borderColor="#444" borderRadius={6}>
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        Generator
      </Text>

      <LanguageSelector language={language} onSelect={onLanguageChange} />

      <Editor
        height="30vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(val) => onCodeChange(val || "")}
      />

      <Button
        mt={3}
        variant="outline"
        colorScheme="blue"
        disabled={isRunning}
        onClick={handleRun}
      >
        {isRunning ? "Running..." : "Run Generator"}
      </Button>

      {/* Show the generated input so the user can verify what was produced */}
      {generatedInput && (
        <Box mt={4}>
          <Text fontSize="sm" color="gray.400" mb={1}>
            Generated Input (will be fed as stdin to both solutions):
          </Text>
          <Textarea
            readOnly
            value={generatedInput}
            fontFamily="mono"
            fontSize="sm"
            bg="#1e1e1e"
            color="#d4d4d4"
            borderColor="#555"
            resize="vertical"
            rows={4}
          />
        </Box>
      )}
    </Box>
  );
};

export default GeneratorPanel;
