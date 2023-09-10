import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { makeStyles, Box, TextField, Grid, IconButton } from "@material-ui/core";
import { Search as SearchIcon, ArrowForward } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";

import { category_list } from "data";

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(2, 0, 4),
    borderRadius: theme.spacing(4),
    boxShadow: theme.shadows[4],

    "& .MuiInputBase-root": {
      fontSize: "0.8rem",
      "& > input": {
        paddingLeft: theme.spacing(3),
      },
    },
    "& fieldset": {
      border: 0,
    },
  },
}));

export const Search: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { search } = history.location;

  const { register, handleSubmit } = useForm<{ search_word: string }>();

  function handleSearch({ search_word }: { search_word: string }) {
    history.push(`/search?search_word=${search_word}`);
  }

  return (
    <Box py={2}>
      <Typography variant="h4" fontWeight={300}>
        Search
      </Typography>

      <TextField
        {...register("search_word")}
        defaultValue={search.split("=")?.[1] || ""}
        fullWidth
        placeholder="하단의 카테고리를 선택하여 레퍼런스를 확인하세요."
        className={classes.search}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(handleSearch)()}
        InputProps={{
          endAdornment: (
            <IconButton edge="end" onClick={handleSubmit(handleSearch)}>
              <SearchIcon color="primary" />
            </IconButton>
          ),
        }}
      />

      {category_list.map((item, index) => (
        <CategoryComponent {...item} key={index} />
      ))}
    </Box>
  );
};

type CategoryType = {
  isWhite?: boolean;
  title: string;
  content: string;
  link: string;
};
const CategoryComponent: React.FC<CategoryType> = ({ isWhite, title, content, link }) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          style={{textTransform: 'none'}}
          px={2}
          py={1.5}
          color={isWhite ? "secondary" : "primary"}
          borderRadius="10px"
          maxWidth="270px"
          onClick={() => history.push(link)}
        >
          <Typography fontWeight={700} textAlign="left">
            {title}
          </Typography>
        </Button>

        <IconButton onClick={() => history.push(link)}>
          <ArrowForward color="primary" />
        </IconButton>
      </Box>

      <Typography mt={1} variant="body2" fontWeight={500} whiteSpace="pre-wrap">
        {content}
      </Typography>
    </Box>
  );
};
