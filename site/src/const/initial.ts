const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export const initialPagination = {
  page: 1,
  pageSize: Number(APP_PAGINATION_LIST_LIMIT),
  total: 0,
  pageTotal: 0,
};

export default {};
