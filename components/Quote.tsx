import { Box, HStack, Text, VStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <HStack alignItems="stretch" justify="flex-start">
      <VStack w="10px" align="end" justify="stretch">
        <Icon as={FaQuoteLeft} boxSize="3" color="var(--lines)" />
        <Box
          marginTop="1px !important"
          borderLeft="var(--card-border)"
          w="5px"
          h="100%"
        />
      </VStack>
      <Text textAlign="start">{children}</Text>
    </HStack>
  );
}
