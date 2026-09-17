import { Box, Button, Text } from "@chakra-ui/react";
import { executeCode } from "./api.js";
import { useState } from "react";
const Output = ({ editorRef, language }) => {
    const [output, setOutput] = useState(null);
    const runCode = async() => {
        const code = editorRef.current.getValue();
        if(!code) return;
        try {
            const {run: result} = await executeCode(language, code);
            setOutput(result.output);
        } catch (error) {
            console.error("Error occurred while running code:", error);
        }
    };

  return (
    <Box w="50%"> 
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button variant="outline" colorScheme="green" mb={4} onClick={runCode}>
        Run Code
      </Button>
      <Box
        height="75vh"
        p={2}
        border="1px solid"
        borderRadius={4}
        borderColor="#333"
      >
        {
            output ? output : 'Click "Run Code" to see the output of your code here.'
        }
      </Box>
    </Box>
  );
};

export default Output;