type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Readonly<PaginationProps>) {
    // generate array of page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5; // Show max 5 page numbers at a time

        if (totalPages <= maxVisiblePages) {
            // show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // always show first page
            pages.push(1);

            // calculate range around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            // add ellipsis (...) after first page if needed
            if (start > 2) {
                pages.push('...');
            }

            // add pages around current page
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // add ... before last page if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null; // Don't show pagination if only 1 page

    return (
        <div className="pagination-container">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {getPageNumbers().map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}