function getPagination(page, limit) {
    const pageNumber = parseInt(page) || 1; 
    const pageSize = parseInt(limit) || 10; 
    const offset = (pageNumber - 1) * pageSize;
  
    return { limit: pageSize, offset, page: pageNumber };
  }
  
  function formatPaginationData(data, page, limit) {
    const totalItems = data.count;
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      results: data.rows,
      totalItems,
      currentPage: page,
      totalPages,
      nextPage: page >= totalPages ? null : page + 1
    };
  }
  
  module.exports = { getPagination, formatPaginationData };
  