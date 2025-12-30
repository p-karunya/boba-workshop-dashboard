import Head from "next/head";
import { Box, Container, Flex, Link, Text, Button, Heading } from "theme-ui";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
  { href: "#ops", label: "Operations" },
  { href: "#pipelines", label: "Pipelines" },
  { href: "#resources", label: "Resources" },
];

const Layout = ({
  children,
  title = "Boba Workshop Dashboard",
  description = "An Airtable-powered dashboard to manage Hack Club Boba Workshops.",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          bg: "background",
          color: "text",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            background: "backdrop",
            backdropFilter: "blur(48px)",
            zIndex: -3,
          }}
        />
        <main>{children}</main>{" "}
      </Box>
    </>
  );
};

export default Layout;
