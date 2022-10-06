import { ConfigProvider, Layout } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { ProLayoutContext } from '../context/ProLayoutContext';
import { useStyle } from '../style/header';
import type { WithFalse } from '../typings';
import { clearMenuItem } from '../utils/utils';
import type { GlobalHeaderProps } from './GlobalHeader';
import { GlobalHeader } from './GlobalHeader';
import type { PrivateSiderMenuProps } from './SiderMenu/SiderMenu';
import { TopNavHeader } from './TopNavHeader';

const { Header } = Layout;

export type HeaderViewProps = GlobalHeaderProps & {
  isMobile?: boolean;
  logo?: React.ReactNode;
  headerRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  headerTitleRender?: WithFalse<
    (logo: React.ReactNode, title: React.ReactNode, props: HeaderViewProps) => React.ReactNode
  >;
  headerContentRender?: WithFalse<
    (props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  siderWidth?: number;
  hasSiderMenu?: boolean;
};

const DefaultHeader: React.FC<HeaderViewProps & PrivateSiderMenuProps> = (props) => {
  const {
    isMobile,
    fixedHeader,
    className: propsClassName,
    style,
    collapsed,
    prefixCls,
    onCollapse,
    layout,
    headerRender,
    headerContentRender,
  } = props;
  const { header } = useContext(ProLayoutContext);
  const renderContent = useCallback(() => {
    const isTop = layout === 'top';
    const clearMenuData = clearMenuItem(props.menuData || []);

    let defaultDom = (
      <GlobalHeader onCollapse={onCollapse} {...props} menuData={clearMenuData}>
        {headerContentRender && headerContentRender(props, null)}
      </GlobalHeader>
    );
    if (isTop && !isMobile) {
      defaultDom = (
        <TopNavHeader
          mode="horizontal"
          onCollapse={onCollapse}
          {...props}
          menuData={clearMenuData}
        />
      );
    }
    if (headerRender && typeof headerRender === 'function') {
      return headerRender(props, defaultDom);
    }
    return defaultDom;
  }, [headerContentRender, headerRender, isMobile, layout, onCollapse, props]);

  const needFixedHeader = fixedHeader || layout === 'mix';

  const isTop = layout === 'top';
  const baseClassName = `${prefixCls}-layout-header`;
  const { wrapSSR, hashId } = useStyle(baseClassName, {
    proLayoutCls: prefixCls || 'ant-pro-layout',
  });

  const className = classNames(propsClassName, hashId, baseClassName, {
    [`${baseClassName}-fixed-header`]: needFixedHeader,
    [`${baseClassName}-mix`]: layout === 'mix',
    [`${baseClassName}-fixed-header-action`]: !collapsed,
    [`${baseClassName}-top-menu`]: isTop,
    [`${baseClassName}-header`]: true,
  });

  if (layout === 'side' && !isMobile) return null;
  return wrapSSR(
    <>
      <ConfigProvider
        // @ts-ignore
        theme={{
          hashed: process.env.NODE_ENV?.toLowerCase() !== 'test',
          override: {
            Layout: {
              colorBgHeader: 'transparent',
              colorBgBody: 'transparent',
            },
          },
        }}
      >
        {needFixedHeader && (
          <Header
            style={{
              height: header.heightLayoutHeader,
              lineHeight: `${header.heightLayoutHeader}px`,
              backgroundColor: 'transparent',
              zIndex: 19,
              ...style,
            }}
          />
        )}
        <Header className={className} style={style}>
          {renderContent()}
        </Header>
      </ConfigProvider>
    </>,
  );
};

export { DefaultHeader };
