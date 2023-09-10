import React, { useState, useEffect } from "react";

import { Box, SwipeableDrawer, IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { Link } from "components";

const page_list = [
  /*
  {
    label: "Experience",
    link: "/",
  },
  */
  {
    label: "Intorduction",
    link: "/start",
  },
  {
    label: "Who we are",
    link: "/profile",
  },
  {
    label: "Photo reference",
    link: "/photo",
  },
  {
    label: "Description",
    link: "/video",
  },
  {
    label: "Style Dream Service",
    link: "/service",
  },
  {
    label: "Reservation",
    link: "/reservation",
  },
  {
    label: "Contact",
    link: "/contact",
  },
];

type NavProps = {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
};

export const Nav: React.FC<NavProps> = ({ isOpen, handleOpen }) => {
  return (
    <SwipeableDrawer anchor="right" open={isOpen} onClose={() => handleOpen(false)} onOpen={() => handleOpen(true)}>
      <Box
        pl={10}
        pr={2}
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-end"
        height="100vh"
        bgcolor="#000"
      >
        {page_list.map((item, index) => (
          <Box textAlign="right" mb={3} key={index}>
            <Link href={item.link} onClick={() => handleOpen(false)}>
              <Typography variant="h5" color="secondary" fontWeight="inherit">
                {item.label}
              </Typography>
            </Link>
          </Box>
        ))}

        <Button mt={15} mb={4} p={1} minWidth="0" borderRadius="50%" onClick={() => handleOpen(false)}>
          <Clear color="primary" />
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};
