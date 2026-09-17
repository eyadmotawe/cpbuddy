import { Box, Button, Menu, Text } from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box mb={4}>
      <Text mb={2} fontSize="lg">
        Language:
      </Text>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline" size="sm">
            {language} ▼
          </Button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            {languages.map(([language, version]) => (
              <Menu.Item key={language} value={language} onClick={() => onSelect(language)}>
                {language} - {version}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
};

export default LanguageSelector;