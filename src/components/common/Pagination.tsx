import * as React from 'react';
import { Pagination } from '@douyinfe/semi-ui';

const MyPagination = ({
    pageCount,
    value = 1,
    handlePageChange,
    pageSize = 50,
    className = '',
}: {
    pageCount: number;
    value?: number;
    pageSize?: number;
    handlePageChange: (page: number) => void;
    className?: string;
}) => {
    const [currentPage, setCurrentPage] = React.useState(value);
    const handleChange = (page: number) => {
        if (page < 1) page = 1;
        if (page > pageCount) page = pageCount;
        setCurrentPage(page);
        handlePageChange(page);
        window.scrollTo(0, 0);
    };

    return (
        <Pagination
            className={className}
            total={pageCount * pageSize}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handleChange}
        ></Pagination>
    );
};

export { MyPagination as Pagination };
