import React, { useState } from "react";
import { Header } from "./Header";
import { Nav } from "./Nav";
import { Box } from "@material-ui/core";

export const Dashboard: React.FC = ({ children }: any) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <Box position="relative">
      <Header handleOpen={() => setNavOpen(true)} />

      <Box bgcolor="#fff">
        <Box height="100px" />
        <Box p={2} minHeight="calc(100vh - 100px)">
          {children}
        </Box>
      </Box>

      <Nav isOpen={navOpen} handleOpen={setNavOpen} />
    </Box>
  );
};
