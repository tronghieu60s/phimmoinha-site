/* eslint-disable no-use-before-define */
import { UploadFile } from 'antd/lib/upload/interface';
import React from 'react';

/* Antd Types */

export type UploadChangeParam<T = UploadFile> = {
  file?: T;
  fileList: T[];
  event?: {
    percent: number;
  };
};

/* Root Types */

export type LogType = 'Unknown' | 'Error' | 'Warning' | 'Info' | 'Debug';

export type LogParams = {
  type: LogType;
  name: string;
  content: string;
};

export type ResponseType<T> = {
  data: T;
  insertId?: string;
  rowsAffected?: number;
  Data: T;
  InsertId?: string;
  RowsAffected?: number;
};

export type Pagination<T> = {
  items: T[];
  pagination?: PaginationType;
  Items: T[];
  Pagination?: PaginationType;
};

export type PaginationType = {
  total: number;
  pageTotal: number;
  page: number;
  pageSize: number;
  nextPage?: number;
  previousPage?: number;
  Total: number;
  PageTotal: number;
  Page: number;
  PageSize: number;
  NextPage?: number;
  PreviousPage?: number;
};

export type PaginationInput = {
  All?: boolean;
  Page?: number;
  PageSize?: number;
};

export type ModeSortOperator = 'Asc' | 'Desc';
export type ModeFilterOperator = 'Default' | 'Insensitive';

export type FilterOperatorInput = {
  Eq?: any;
  Ne?: string;
  In?: string[];
  NIn?: string[];
  Ct?: string;
  Gt?: number;
  Gte?: number;
  Lt?: number;
  Lte?: number;
  Stw?: string;
  Enw?: string;
  Mode?: ModeFilterOperator;
};

export type MenuType = {
  key: string;
  path?: string;
  query?: string;
  title: string;
  icon?: React.ComponentType<any>;
  children?: MenuType[];
  hidden?: boolean;
};

export type SiteType = {
  key: string;
  path?: string;
  element?: React.ComponentType<any>;
  children?: SiteType[];
};

export type UploadType = {
  upload_key?: string;
  upload_type?: string;
  upload_path?: string;
  upload_generate?: string;
  upload_size?: number;
  upload_created?: string;
};

export type CreateUploadType = {
  uploads_params?: {
    upload_type: string;
    upload_name: string;
  }[];
};

/* Common Types */

export type GetDocParams<T> = {
  id?: string;
  params?: T;
  filter?: T;
};

export type GetListParams<T> = {
  params?: {
    search?: T;
    page?: number;
    pageSize?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    loadAll?: boolean;
    loadMore?: boolean;
  };
};

/* Option Types */

export type OptionType<T = any> = {
  _id?: string;
  option_name?: string;
  option_value?: T;
};

export type OptionMenuType = {
  _id?: string;
  menu_title?: string;
  menu_content?: OptionMenuItemType[];
};

export type OptionMenuItemType = {
  _id?: string;
  menu_path?: string;
  menu_title?: string;
};

/* Tool Types */

export type ToolUseType = 'movies' | 'options' | 'posts' | 'terms' | 'users';
export type ToolDetailType = 'import' | 'export';
export type ToolStatusType =
  | 'completed'
  | 'wait'
  | 'waiting'
  | 'active'
  | 'delayed'
  | 'failed'
  | 'paused';

export type ToolType = {
  _id?: string;
  tool_type?: ToolDetailType;
  tool_use_type?: ToolUseType;
  tool_status?: ToolStatusType;
  tool_file?: string;
  tool_finished_on?: string;
  tool_processed_on?: string;
  tool_failed?: string;
};

export type CreateToolType = {
  type: ToolDetailType;
  use_type?: ToolUseType;
  name?: string;
  folder?: string;
  priority?: number;
  fields: { [key: string]: string };
};

export type GetListToolsParams = GetListParams<ToolType> & {
  type: ToolDetailType;
  params?: {
    orderby?: 'tool_type';
  };
};
