/**
 * Pagination Component
 * Navigate through pages of data
 */

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
      <ul className="pagination mb-0">
        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* First page if not visible */}
        {start > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange?.(1)}>
                1
              </button>
            </li>
            {start > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange?.(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Last page if not visible */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange?.(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
