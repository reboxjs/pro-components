import React, { useEffect, useContext, useRef, useState, useCallback, useMemo } from 'react';
import { Table, ConfigProvider, Card, Empty } from 'antd';
import { useIntl, ParamsType, ConfigProviderWrap } from '@ant-design/pro-provider';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { stringify } from 'use-json-comparison';
import { TablePaginationConfig } from 'antd/lib/table';
import {
  TableCurrentDataSource,
  SorterResult,
  SortOrder,
  GetRowKey,
} from 'antd/lib/table/interface';
import { useDeepCompareEffect, omitUndefined } from '@ant-design/pro-utils';

import useFetchData from './useFetchData';
import Container from './container';
import Toolbar from './component/ToolBar';
import Alert from './component/Alert';
import FormSearch from './Form';
import {
  genColumnKey,
  mergePagination,
  useActionType,
  postDataPipeline,
  tableColumnSort,
  genColumnList,
} from './utils';
import ErrorBoundary from './component/ErrorBoundary';
import './index.less';
import useEditor from './component/useEditor';
import { ProTableProps, RequestData, TableRowSelection } from './typing';
import Form from 'antd/lib/form/Form';

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProTable = <T extends {}, U extends ParamsType>(
  props: ProTableProps<T, U> & {
    defaultClassName: string;
  },
) => {
  const {
    request,
    className: propsClassName,
    params = {},
    defaultData = [],
    headerTitle,
    postData,
    pagination: propsPagination,
    actionRef,
    columns: propsColumns = [],
    toolBarRender,
    onLoad,
    onRequestError,
    style,
    cardProps,
    tableStyle,
    tableClassName,
    columnsStateMap,
    onColumnsStateChange,
    options,
    search,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
    tableAlertRender,
    defaultClassName,
    formRef,
    type = 'table',
    onReset = () => {},
    columnEmptyText = '-',
    manualRequest = false,
    toolbar,
    ...rest
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useMergedState<React.ReactText[]>([], {
    value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
  });

  const [selectedRows, setSelectedRows] = useMergedState<T[]>([]);

  const setSelectedRowsAndKey = (keys: React.ReactText[], rows: T[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const [formSearch, setFormSearch] = useState<{} | undefined>(undefined);

  const [proFilter, setProFilter] = useState<{
    [key: string]: React.ReactText[];
  }>({});
  const [proSort, setProSort] = useState<{
    [key: string]: SortOrder;
  }>({});

  /**
   * 获取 table 的 dom ref
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<() => void>();
  const intl = useIntl();

  /**
   * 是否首次加载的指示器
   */
  const manualRequestRef = useRef<boolean>(manualRequest);

  /**
   * 需要初始化 不然默认可能报错
   * 这里取了 defaultCurrent 和 current
   * 为了保证不会重复刷新
   */
  const fetchPagination =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1 };

  const action = useFetchData(
    async (pageParams) => {
      // 需要手动触发的首次请求
      if (!request || manualRequestRef.current) {
        manualRequestRef.current = false;
        return {
          data: props.dataSource || [],
          success: true,
        } as RequestData<T>;
      }

      const actionParams = {
        ...(pageParams || {}),
        ...formSearch,
        ...params,
      };

      // eslint-disable-next-line no-underscore-dangle
      delete (actionParams as any)._timestamp;

      const response = await request((actionParams as unknown) as U, proSort, proFilter);
      const responseData = postDataPipeline<T[], U>(
        response.data,
        [postData].filter((item) => item) as any,
      );
      if (Array.isArray(response)) {
        return response;
      }
      const msgData = { ...response, data: responseData } as RequestData<T>;
      return msgData;
    },
    defaultData,
    {
      ...fetchPagination,
      pagination: propsPagination !== false,
      onLoad,
      onRequestError,
      manual: !request || (!formSearch && search !== false),
      effects: [stringify(params), stringify(formSearch), stringify(proFilter), stringify(proSort)],
    },
  );

  useEffect(() => {
    fullScreen.current = () => {
      if (!rootRef.current || !document.fullscreenEnabled) {
        return;
      }

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        rootRef.current.requestFullscreen();
      }
    };
  }, [rootRef.current]);

  action.fullScreen = fullScreen.current;

  const pagination = mergePagination<T, {}>(propsPagination, action, intl);

  const counter = Container.useContainer();

  const onCleanSelected = useCallback(() => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], []);
    }
    setSelectedRowsAndKey([], []);
  }, [setSelectedRowKeys, propsRowSelection]);
  /**
   * 绑定 action
   */
  useActionType(actionRef, counter, () => {
    // 清空选中行
    onCleanSelected();
    // 清空筛选
    setProFilter({});
    // 清空排序
    setProSort({});
    // 清空 toolbar 搜索
    counter.setKeyWords(undefined);
  });
  counter.setAction(action);
  counter.propsRef.current = props;
  /**
   *  保存一下 propsColumns
   *  生成 form 需要用
   */
  useDeepCompareEffect(() => {
    counter.setProColumns(propsColumns);
  }, [propsColumns]);

  // ============================ RowKey ============================
  const getRowKey = React.useMemo<GetRowKey<T>>(() => {
    const { rowKey } = props;
    if (typeof rowKey === 'function') {
      return rowKey;
    }

    return (record: T) => (record as any)?.[rowKey as string];
  }, [props.rowKey]);

  const editorUtils = useEditor<any>({ ...props.rowEditor, getRowKey });

  const tableColumn = useMemo(() => {
    return genColumnList<T>({
      columns: propsColumns,
      map: counter.columnsMap,
      counter,
      columnEmptyText,
      type,
      editorUtils,
    }).sort(tableColumnSort(counter.columnsMap));
  }, [propsColumns, editorUtils.editorRowKeys.join(',') || 'null', counter.columnsMap, getRowKey]);

  /**
   * Table Column 变化的时候更新一下，这个参数将会用于渲染
   */
  useDeepCompareEffect(() => {
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
      // 重新生成key的字符串用于排序
      const columnKeys = tableColumn.map((item, index) => genColumnKey(item.key, index));
      counter.setSortKeyColumns(columnKeys);
    }
  }, [tableColumn]);

  /**
   * 同步 Pagination，支持受控的 页码 和 pageSize
   */
  useDeepCompareEffect(() => {
    const { current, pageSize } = propsPagination || {};
    if (
      propsPagination &&
      (current || pageSize) &&
      (pageSize !== action.pageSize || current !== action.current)
    ) {
      action.setPageInfo({
        pageSize: pageSize || action.pageSize,
        page: current || action.current,
      });
    }
  }, [propsPagination && propsPagination.pageSize, propsPagination && propsPagination.current]);

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (keys, rows) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows);
      }
      setSelectedRowsAndKey(keys, rows);
    },
  };

  if (props.columns && props.columns.length < 1) {
    return (
      <Card bordered={false} bodyStyle={{ padding: 50 }}>
        <Empty />
      </Card>
    );
  }

  const className = classNames(defaultClassName, propsClassName);

  const searchNode = (search !== false || type === 'form') && (
    <FormSearch<U>
      submitButtonLoading={action.loading}
      {...rest}
      type={type}
      formRef={formRef}
      onSubmit={(value, firstLoad) => {
        if (type !== 'form') {
          const submitParams = {
            ...value,
            _timestamp: Date.now(),
          };
          setFormSearch(beforeSearchSubmit(submitParams));
          if (!firstLoad) {
            // back first page
            action.resetPageIndex();
          }
        }
        // 不是第一次提交就不触发，第一次提交是 js 触发的
        // 为了解决 https://github.com/ant-design/pro-components/issues/579
        if (props.onSubmit && !firstLoad) {
          props.onSubmit(value);
        }
      }}
      onReset={(value) => {
        setFormSearch(beforeSearchSubmit(value));
        // back first page
        action.resetPageIndex();
        onReset();
      }}
      dateFormatter={rest.dateFormatter}
      search={search}
    />
  );
  const isLightFilter: boolean = search !== false && search?.filterType === 'light';

  const toolbarProps =
    toolbar || isLightFilter
      ? {
          filter: searchNode,
          ...toolbar,
        }
      : undefined;

  const toolbarDom = toolBarRender !== false &&
    (options !== false || headerTitle || toolBarRender || toolbarProps) && (
      // if options= false & headerTitle=== false, hide Toolbar
      <Toolbar<T>
        options={options}
        headerTitle={headerTitle}
        action={action}
        onSearch={(keyword) => {
          if (!options || !options.search) {
            return;
          }
          const { name = 'keyword' } = options.search === true ? {} : options.search;
          setFormSearch(
            omitUndefined({
              ...formSearch,
              _timestamp: Date.now(),
              [name]: keyword,
            }),
          );
        }}
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
        toolBarRender={toolBarRender}
        toolbar={toolbarProps}
      />
    );

  const alertDom = propsRowSelection !== false && (
    <Alert<T>
      selectedRowKeys={selectedRowKeys}
      selectedRows={selectedRows}
      onCleanSelected={onCleanSelected}
      alertOptionRender={rest.tableAlertOptionRender}
      alertInfoRender={tableAlertRender}
    />
  );
  const dataSource = request ? (action.dataSource as T[]) : props.dataSource || [];
  const loading = props.loading !== undefined ? props.loading : action.loading;

  const tableProps = {
    ...rest,
    size: counter.tableSize,
    rowSelection: propsRowSelection === false ? undefined : rowSelection,
    className: tableClassName,
    style: tableStyle,
    columns: counter.columns.filter((item) => {
      // 删掉不应该显示的
      const columnKey = genColumnKey(item.key, item.index);
      const config = counter.columnsMap[columnKey];
      if (config && config.show === false) {
        return false;
      }
      return true;
    }),
    loading,
    dataSource: request ? (action.dataSource as T[]) : props.dataSource || [],
    pagination,
    onChange: (
      changePagination: TablePaginationConfig,
      filters: {
        [string: string]: React.ReactText[] | null;
      },
      sorter: SorterResult<T> | SorterResult<T>[],
      extra: TableCurrentDataSource<T>,
    ) => {
      if (rest.onChange) {
        rest.onChange(changePagination, filters, sorter, extra);
      }
      // 制造筛选的数据
      setProFilter(omitUndefined<any>(filters));
      // 制造一个排序的数据
      if (Array.isArray(sorter)) {
        const data = sorter.reduce<{
          [key: string]: any;
        }>((pre, value) => {
          return {
            ...pre,
            [`${value.field}`]: value.order,
          };
        }, {});
        setProSort(omitUndefined<any>(data));
      } else {
        setProSort(omitUndefined({ [`${sorter.field}`]: sorter.order as SortOrder }));
      }
    },
  };
  /**
   * 如果有 ellipsis ，设置 tableLayout 为 fixed
   */
  const tableLayout = props.columns?.some((item) => item.ellipsis) ? 'fixed' : 'auto';
  const tableDom = props.tableViewRender ? (
    props.tableViewRender(tableProps)
  ) : (
    <Form component={false} onValuesChange={(d) => console.log(d)}>
      <Table<T> {...tableProps} tableLayout={tableLayout} />
    </Form>
  );
  /**
   * table 区域的 dom，为了方便 render
   */
  const tableAreaDom = (
    <Card
      bordered={false}
      style={{
        height: '100%',
      }}
      bodyStyle={
        toolbarDom
          ? {
              paddingTop: 0,
              paddingBottom: 0,
            }
          : {
              padding: 0,
            }
      }
      {...cardProps}
    >
      {toolbarDom}
      {alertDom}
      {tableDom}
    </Card>
  );

  const renderTable = () => {
    if (props.tableRender) {
      return props.tableRender(props, tableAreaDom, {
        toolbar: toolbarDom || undefined,
        alert: alertDom || undefined,
        table: tableDom || undefined,
      });
    }
    return tableAreaDom;
  };

  const proTableDom = (
    <div className={className} id="ant-design-pro-table" style={style} ref={rootRef}>
      {isLightFilter ? null : searchNode}
      {/* 渲染一个额外的区域，用于一些自定义 */}
      {type !== 'form' && props.tableExtraRender && (
        <div className={`${className}-extra`}>{props.tableExtraRender(props, dataSource)}</div>
      )}
      {type !== 'form' && renderTable()}
    </div>
  );

  // 如果不需要的全屏，ConfigProvider 没有意义
  if (!options || !options?.fullScreen) {
    return proTableDom;
  }
  return (
    <ConfigProvider
      getPopupContainer={() => ((rootRef.current || document.body) as any) as HTMLElement}
    >
      {proTableDom}
    </ConfigProvider>
  );
};

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProviderWarp = <T, U extends { [key: string]: any } = {}>(props: ProTableProps<T, U>) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  return (
    <Container.Provider initialState={props}>
      <ConfigProviderWrap>
        <ErrorBoundary>
          <ProTable defaultClassName={getPrefixCls('pro-table')} {...props} />
        </ErrorBoundary>
      </ConfigProviderWrap>
    </Container.Provider>
  );
};

export default ProviderWarp;
