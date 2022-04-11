import React, { useEffect, useState } from 'react'
import {
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
const AppPagination = ({ paging, lisener, currentPage, hasNextPage, hasPreviousPage }) => {
    const [previous, setPreviousPageDisable] = useState(false);
    const [next, setNextPageDisable] = useState(false);

    useEffect(() => {
        // console.log("paging,currentPage---------",paging,currentPage)
        hasNextPage ? setNextPageDisable(false) : setNextPageDisable(true)
        hasPreviousPage ? setPreviousPageDisable(false) : setPreviousPageDisable(true)
    }, [hasNextPage, hasPreviousPage]);

    return (
        <>
            {
                paging.length > 1 && <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled={previous}>
                        <PaginationLink onClick={() => lisener(currentPage - 1)} tabIndex="-1">
                            Previous
                        </PaginationLink>
                    </PaginationItem>

                    {
                        paging.map((item, index) => <PaginationItem key={index} active={item.active}>
                            <PaginationLink onClick={() => lisener(item.page)}>{item.page}</PaginationLink>
                        </PaginationItem>)
                    }

                    <PaginationItem disabled={next}>
                        <PaginationLink onClick={() => lisener(currentPage + 1)} >Next</PaginationLink>
                    </PaginationItem>
                </Pagination>
            }

        </>
    )
}

export default AppPagination
