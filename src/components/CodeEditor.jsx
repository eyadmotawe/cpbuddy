import { Box, HStack } from "@chakra-ui/react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useState, useRef } from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";

loader.config({ monaco });

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [value, setValue] = useState("// some comment");
    const [language, setLanguage] = useState("javascript");
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  }
  return (
    <Box textAlign="left">
      <HStack gap={4} align="start">
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height="75vh"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            value={value}
            onChange={(val) => setValue(val || "")}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;