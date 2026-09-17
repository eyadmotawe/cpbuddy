import { Box, HStack, Text } from "@chakra-ui/react";

// Split output into lines, dropping trailing empty lines so that
// a trailing newline doesn't create a phantom extra "missing" line.
const toLines = (str) => str.trimEnd().split("\n");

// DiffPanel: a pure display component — it receives two output strings
// and renders them side-by-side, line by line.
// Lines that match get a green tint; mismatching lines are red.
// No external diff library is needed — simple array zip + equality check.
const DiffPanel = ({ outputA, outputB }) => {
  // Don't render at all until at least one side has output
  if (!outputA && !outputB) return null;

  const linesA = toLines(outputA || "");
  const linesB = toLines(outputB || "");
  // Iterate over the longer side so we catch extra/missing lines
  const maxLen = Math.max(linesA.length, linesB.length);

  const rows = Array.from({ length: maxLen }, (_, i) => {
    const a = i < linesA.length ? linesA[i] : "(missing)";
    const b = i < linesB.length ? linesB[i] : "(missing)";
    return { i, a, b, match: a === b };
  });

  const mismatchCount = rows.filter((r) => !r.match).length;

  return (
    <Box mt={6} p={4} border="1px solid" borderColor="#444" borderRadius={6}>
      {/* Summary verdict */}
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Diff —{" "}
        {mismatchCount === 0 ? (
          <Text as="span" color="green.400">✅ Outputs match</Text>
        ) : (
          <Text as="span" color="red.400">
            ❌ {mismatchCount} mismatch{mismatchCount > 1 ? "es" : ""}
          </Text>
        )}
      </Text>

      {/* ── Raw output boxes ── */}
      {/* Shown side by side so the user can read each solution's full output */}
      <HStack align="start" gap={4} mb={6}>
        <Box flex={1}>
          <Text fontSize="sm" color="gray.400" mb={1}>Solution A — raw output</Text>
          <Box
            p={3}
            bg="#1e1e1e"
            border="1px solid"
            borderColor="#444"
            borderRadius={4}
            fontFamily="mono"
            fontSize="sm"
            color="#d4d4d4"
            whiteSpace="pre-wrap"
            // Cap height and scroll so a huge output doesn't push everything off screen
            maxH="20vh"
            overflowY="auto"
          >
            {outputA || <Text as="span" color="gray.600">(no output yet)</Text>}
          </Box>
        </Box>

        <Box flex={1}>
          <Text fontSize="sm" color="gray.400" mb={1}>Brute Force — raw output</Text>
          <Box
            p={3}
            bg="#1e1e1e"
            border="1px solid"
            borderColor="#444"
            borderRadius={4}
            fontFamily="mono"
            fontSize="sm"
            color="#d4d4d4"
            whiteSpace="pre-wrap"
            maxH="20vh"
            overflowY="auto"
          >
            {outputB || <Text as="span" color="gray.600">(no output yet)</Text>}
          </Box>
        </Box>
      </HStack>

      {/* ── Line-by-line diff ── */}
      <Text fontSize="sm" color="gray.500" mb={2}>Line-by-line diff:</Text>

      {/* Column headers */}
      <HStack fontFamily="mono" fontSize="xs" color="gray.500" mb={1} px={2}>
        <Text w="8">ln</Text>
        <Text flex={1}>Solution A</Text>
        <Text flex={1}>Brute Force</Text>
      </HStack>

      {/* One row per line number */}
      {rows.map(({ i, a, b, match }) => (
        <HStack
          key={i}
          fontFamily="mono"
          fontSize="sm"
          bg={match ? "rgba(0,200,0,0.07)" : "rgba(255,50,50,0.12)"}
          px={2}
          py={1}
          borderRadius={3}
          mb={1}
          align="start"
        >
          <Text w="8" color="gray.500" flexShrink={0}>{i + 1}</Text>
          {/* Green tint for the matching side, red for the differing side */}
          <Text flex={1} color={match ? "#d4d4d4" : "green.300"} whiteSpace="pre-wrap">
            {a}
          </Text>
          <Text flex={1} color={match ? "#d4d4d4" : "red.300"} whiteSpace="pre-wrap">
            {b}
          </Text>
        </HStack>
      ))}
    </Box>
  );
};

export default DiffPanel;
