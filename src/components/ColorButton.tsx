import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";

const ColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button marginLeft={1} style={{
      borderTopLeftRadius: 100,
      borderBottomLeftRadius: 100,
    }} size="lg" borderRadius={500} onClick={toggleColorMode}>
      {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export { ColorModeButton };
