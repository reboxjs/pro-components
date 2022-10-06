import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import { useSafeState } from '@ant-design/pro-utils';
import type { AvatarProps, BreadcrumbProps, TagType } from 'antd';
import { Avatar, Breadcrumb, Button, ConfigProvider, Space } from 'antd';
import type { DirectionType } from 'antd/es/config-provider';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import * as React from 'react';
import useStyle from './style/index';

export interface PageHeaderProps {
  backIcon?: React.ReactNode;
  prefixCls?: string;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  style?: React.CSSProperties;
  breadcrumb?: BreadcrumbProps | React.ReactElement<typeof Breadcrumb>;
  breadcrumbRender?: (props: PageHeaderProps, defaultDom: React.ReactNode) => React.ReactNode;
  tags?: React.ReactElement<TagType> | React.ReactElement<TagType>[];
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  avatar?: AvatarProps;
  onBack?: (e?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  ghost?: boolean;
  children?: React.ReactNode;
}

const renderBack = (
  prefixCls: string,
  backIcon?: React.ReactNode,
  onBack?: (e?: React.MouseEvent<HTMLElement>) => void,
) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <div className={`${prefixCls}-back`}>
      <Button
        type="text"
        onClick={(e) => {
          onBack?.(e);
        }}
        className={`${prefixCls}-back-button`}
        aria-label="back"
      >
        {backIcon}
      </Button>
    </div>
  );
};

const renderBreadcrumb = (breadcrumb: BreadcrumbProps, prefixCls: string) => (
  <Breadcrumb
    {...breadcrumb}
    className={classNames(`${prefixCls}-breadcrumb`, breadcrumb.className)}
  />
);

const getBackIcon = (props: PageHeaderProps, direction: DirectionType = 'ltr') => {
  if (props.backIcon !== undefined) {
    return props.backIcon;
  }
  return direction === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />;
};

const renderTitle = (
  prefixCls: string,
  props: PageHeaderProps,
  direction: DirectionType = 'ltr',
  hashId: string,
) => {
  const { title, avatar, subTitle, tags, extra, onBack } = props;
  const headingPrefixCls = `${prefixCls}-heading`;
  const hasHeading = title || subTitle || tags || extra;
  // If there is nothing, return a null
  if (!hasHeading) {
    return null;
  }
  const backIcon = getBackIcon(props, direction);
  const backIconDom = renderBack(prefixCls, backIcon, onBack);
  const hasTitle = backIconDom || avatar || hasHeading;
  return (
    <div className={headingPrefixCls + ' ' + hashId}>
      {hasTitle && (
        <div className={`${headingPrefixCls}-left ${hashId}`}>
          {backIconDom}
          {avatar && (
            <Avatar
              className={classNames(`${headingPrefixCls}-avatar`, hashId, avatar.className)}
              {...avatar}
            />
          )}
          {title && (
            <span
              className={`${headingPrefixCls}-title ${hashId}`}
              title={typeof title === 'string' ? title : undefined}
            >
              {title}
            </span>
          )}
          {subTitle && (
            <span
              className={`${headingPrefixCls}-sub-title ${hashId}`}
              title={typeof subTitle === 'string' ? subTitle : undefined}
            >
              {subTitle}
            </span>
          )}
          {tags && <span className={`${headingPrefixCls}-tags ${hashId}`}>{tags}</span>}
        </div>
      )}
      {extra && (
        <span className={`${headingPrefixCls}-extra ${hashId}`}>
          <Space>{extra}</Space>
        </span>
      )}
    </div>
  );
};

const renderFooter = (prefixCls: string, footer: React.ReactNode, hashId: string) => {
  if (footer) {
    return <div className={`${prefixCls}-footer ${hashId}`}>{footer}</div>;
  }
  return null;
};

const renderChildren = (prefixCls: string, children: React.ReactNode, hashId: string) => (
  <div className={`${prefixCls}-content ${hashId}`}>{children}</div>
);

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const [compact, updateCompact] = useSafeState(false);
  const onResize = ({ width }: { width: number }) => {
    updateCompact(width < 768, true);
  };
  const { getPrefixCls, pageHeader, direction } = React.useContext(ConfigProvider.ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    style,
    footer,
    children,
    breadcrumb,
    breadcrumbRender,
    className: customizeClassName,
  } = props;
  let ghost: undefined | boolean = true;

  // Use `ghost` from `props` or from `ConfigProvider` instead.
  if ('ghost' in props) {
    ghost = props.ghost;
  } else if (pageHeader && 'ghost' in pageHeader) {
    ghost = pageHeader.ghost;
  }

  const prefixCls = getPrefixCls('page-header', customizePrefixCls);
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const getDefaultBreadcrumbDom = () => {
    if ((breadcrumb as BreadcrumbProps)?.routes) {
      return renderBreadcrumb(breadcrumb as BreadcrumbProps, prefixCls);
    }
    return null;
  };

  const defaultBreadcrumbDom = getDefaultBreadcrumbDom();

  const isBreadcrumbComponent = breadcrumb && 'props' in breadcrumb;
  // support breadcrumbRender function
  const breadcrumbRenderDomFromProps =
    breadcrumbRender?.({ ...props, prefixCls }, defaultBreadcrumbDom) ?? defaultBreadcrumbDom;

  const breadcrumbDom = isBreadcrumbComponent ? breadcrumb : breadcrumbRenderDomFromProps;

  const className = classNames(prefixCls, props.className, customizeClassName, {
    hashId,
    [`${prefixCls}-has-breadcrumb`]: !!breadcrumbDom,
    [`${prefixCls}-has-footer`]: !!footer,
    [`${prefixCls}-ghost`]: ghost,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-compact`]: compact,
  });
  const title = renderTitle(prefixCls, props, direction, hashId);
  const childDom = children && renderChildren(prefixCls, children, hashId);
  const footerDom = renderFooter(prefixCls, footer, hashId);

  if (!breadcrumbDom && !title && !footerDom && !childDom) {
    return null;
  }

  return wrapSSR(
    <ResizeObserver onResize={onResize}>
      <div className={className} style={style}>
        {breadcrumbDom}
        {title}
        {childDom}
        {footerDom}
      </div>
    </ResizeObserver>,
  );
};

export { PageHeader };
