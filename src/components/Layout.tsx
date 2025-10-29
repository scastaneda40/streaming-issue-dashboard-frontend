"use client";

import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      <Box bg="gray.700" p={4} color="white">
        <Flex maxW="container.xl" mx="auto" align="center">
          <Text fontSize="xl" fontWeight="bold">
            Streaming Issue Dashboard
          </Text>
          <Box ml="auto">
            <NextLink href="/" passHref legacyBehavior>
              <Link px={2}>Dashboard</Link>
            </NextLink>
            <NextLink href="/about" passHref legacyBehavior>
              <Link px={2}>About</Link>
            </NextLink>
          </Box>
        </Flex>
      </Box>
      <Box as="main" flex={1} p={4} maxW="container.xl" mx="auto" w="full">
        {children}
      </Box>
      <Box bg="gray.700" p={4} color="white" textAlign="center">
        <Text>&copy; {new Date().getFullYear()} Streaming Issue Dashboard</Text>
      </Box>
    </Flex>
  );
}
