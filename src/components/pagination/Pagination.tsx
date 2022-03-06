import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "../../hooks/usePagination";
import classes from "./Pagination.module.css";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  let lastPage = paginationRange[paginationRange.length - 1];

  const onNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <ul
      className={classnames(classes.paginationcontainer, {
        [className]: className,
      })}
    >
      {/* Left navigation arrow */}
      <li
        className={classnames(classes.paginationitem, {
          [`${classes.disabled}`]: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <div className={`${classes.arrow} ${classes.left}`} />
      </li>
      {paginationRange.map((pageNumber, idx) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li
              key={idx}
              className={`${classes.paginationitem} ${classes.dots}`}
            >
              &#8230;
            </li>
          );
        }

        // Render our Page Pills
        return (
          <li
            key={idx}
            className={classnames(classes.paginationitem, {
              [`${classes.selected}`]: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li
        className={classnames(classes.paginationitem, {
          [`${classes.disabled}`]: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <div className={`${classes.arrow} ${classes.right}`} />
      </li>
    </ul>
  );
};

export default Pagination;
