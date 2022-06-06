import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Search = ({ dispatchFunc }) => {
  // SEARCH

//   console.log({dispatchFunc})

  const dispatch = useDispatch();

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      // const context = this;
      timer = setTimeout(() => {
        func(args[0]);
      }, delay);
    };
    // console.log("yes....");
  };

  // SEARCH INPUT CHANGE

  const handleSearchChange = (event) => {
    // console.log("event", event.target.value)
    // setOpen(true);
    dispatch(dispatchFunc(event.target.value));
  };

  const searchKeyListener = debounce(handleSearchChange, 300);

  return (
    <div className="mb-4">
      <label className="control-label">Search</label>

      <SearchWrapper>
        <div className="search__wrapper">
          <i className="fa fa-search" />
          <input
            className="form-control"
            type="search"
            placeholder="Search Here..."
            id="search"
            onChange={searchKeyListener}
          />
        </div>
      </SearchWrapper>
    </div>
  );
};

const SearchWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  width: 100%;
  padding: 2px 7px;

  .search__wrapper {
    /* padding: 7px 10px; */
    display: flex;
    align-items: center;
    i {
      font-size: 15px;
    }
    input {
      border: none;
      color: black !important;
    }
  }
`;

export default Search;
