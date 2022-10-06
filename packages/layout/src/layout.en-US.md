---
title: ProLayout
order: 0
legacy: /layout
group:
  path: /
nav:
  title: Components
  path: /components
---

# ProLayout - Advanced Layout

ProLayout provides a standard, yet flexible, middle and backend layout, with one-click layout switching and automatic menu generation. It can be used with PageContainer to automatically generate breadcrumbs, page headers, and provide a low-cost solution to access the footer toolbar.

## When to use

ProLayout can be used to reduce layout costs when content needs to be carried on a page.

### Use with umi plugins

ProLayout works best with umi. umi automatically injects the routes from config.ts into the configured layout for us, so we don't have to write the menus by hand.

ProLayout extends umi's router configuration, adding name, icon, locale, hideInMenu, hideChildrenInMenu and other configurations, so that it is easier to generate menus in one place. The data format is as follows.

```ts | pure
export interface MenuDataItem {
  /** @name submenu */
  routes?: MenuDataItem[];
  /** @name Hide child nodes in the menu */
  hideChildrenInMenu?: boolean;
  /** @name hideSelf and children in menu */
  hideInMenu?: boolean;
  /** @name Icon of the menu */
  icon?: React.ReactNode;
  /** @name Internationalization key for custom menus */
  locale?: string | false;
  /** @name The name of the menu */
  name?: string;
  /** @name is used to calibrate the selected value, default is path */
  key?: string;
  /** @name disable menu option */
  disabled?: boolean;
  /** @name path */
  path?: string;
  /**
   * When this node is selected, the node of parentKeys is also selected
   *
   * @name custom parent node
   */
  parentKeys?: string[];
  /** @name hides itself and elevates child nodes to its level */
  flatMenu?: boolean;

  [key: string]: any;
}
```

ProLayout will automatically select the menu based on `location.pathname` and automatically generate the corresponding breadcrumbs. If you don't want to use it, you can configure `selectedKeys` and `openKeys` yourself for controlled configuration.

## Code Demo

### Basic usage

<code src="./demos/base.tsx"  height="500px" iframe="650px" />

### Load menu from server

ProLayout provides a powerful menu, but this necessarily encapsulates a lot of behavior, leading to dissatisfaction for users who need some special logic. So we provide a number of APIs that are expected to satisfy the vast majority of our clients in this way.

The main APIs used to load menu from the server are `menuDataRender` and `menuRender`, `menuDataRender` controls the current menu data and `menuRender` controls the menu's dom node.

<code src="./demos/dynamicMenu.tsx"  height="500px" iframe="500px" />

### Load the menu from the server and use the icon

Here is mainly a demo where we need to prepare an enumeration for icon rendering, which can significantly reduce the size of the package

<code src="./demos/antd@4MenuIconFormServe.tsx"  height="500px" iframe="500px" />

### Customize the content of the menu

With `menuItemRender`, `subMenuItemRender`, `title`, `logo`, `menuHeaderRender` you can customize the menu style very easily. If you are really not satisfied, you can use `menuRender` to fully customize it.

<code src="./demos/customizeMenu.tsx"  height="500px" iframe="500px" />

### Custom footer

ProLayout does not provide footer by default, if you want to have the same style as Pro official website, you need to introduce a footer by yourself.

<code src="./demos/footer.tsx"  height="500px" iframe="500px" />

This is used to show various applications of ProLayout, if you think your usage can help others, feel free to PR.

### Search menu

<code src="./demos/searchMenu.tsx"  height="500px" iframe="500px" />

### Multiple routes correspond to one menu item

<code src="./demos/MultipleMenuOnePath.tsx"  height="500px" iframe="500px" />

### Open all menus by default

<code src="./demos/DefaultOpenAllMenu.tsx"  height="500px" iframe="500px" />

### Using IconFont

<code src="./demos/IconFont.tsx"  height="500px" iframe="500px" />

### ghost mode

PageContainer configuration `ghost` can switch the page header to transparent mode.

<code src="./demos/ghost.tsx"  height="500px" iframe="500px" />

### Nested Layout

<code src="./demos/Nested.tsx"  height="500px" iframe="500px" />

### Customized collapsed

<code src="./demos/customize-collapsed.tsx"  height="500px" iframe="500px" />

## API

### ProLayout

> All methods suffixed with `Render` can be made not to render by passing `false`.

| Parameters | Description | Type | Default |
| --- | --- | --- | --- |
| title | The title of the top-left corner of the layout | `ReactNode` | `'Ant Design Pro'` |
| logo | url to the top-left corner of layout's logo | `ReactNode` \| `()=> ReactNode` | - |
| pure | Whether to remove all self-contained interfaces | `boolean` | - |
| loading | The loading state of the layout | `boolean` | - |
| location | The location information of the current application session. If your application creates a custom history, you will need to display the location attribute as described in [issue](https://github.com/ant-design/pro-components/issues/327) | [history.location](https://reactrouter.com/web/api/history) | isBrowser ? window.location : undefined |
| menuHeaderRender | render logo and title | `ReactNode` \| `(logo,title)=>ReactNode` | - |
| menuFooterRender | Render a block at the bottom of the layout | `(menuProps)=>ReactNode` | - |
| onMenuHeaderClick | menu menu menu's header click event | `(e: React.MouseEvent<HTMLDivElement>) => void` | - |
| menuExtraRender | Renders a region below the menu header | `(menuProps)=>ReactNode` | - |
| onTopMixMenuHeaderClick | the header click event of the top bar in mix mode | `(e: React.MouseEvent<HTMLDivElement>) => void` | - |
| contentStyle | layout's content area style | CSSProperties | - |
| layout | layout's menu mode,side: right-hand navigation,top: top navigation | `side` \| `top` | `side` |
| contentWidth | content mode of layout,Fluid: adaptive,Fixed: fixed 1200px | `Fluid` \| `Fixed` | `Fluid` |
| fixedHeader | Whether to fix the header to the top | `boolean` | `false` |
| fixSiderbar | whether to fix the navigation | `boolean` | `false` |
| breakpoint | Trigger [breakpoint](https://ant.design/components/grid/#Col) for responsive layouts | `Enum { 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' }` | `lg` |
| menu | For the moment, only locale,locale can be turned off for the menu's own globalization | `{ locale: boolean, defaultOpenAll: boolean }` | `{ locale: true }` |
| iconfontUrl | Use the icon configuration of [IconFont](https://ant.design/components/icon/#components-icon-demo-iconfont) | `URL` | - |
| iconPrefixes | icon prefix of side menu | `string` | `icon-` |
| locale | Language settings for the current layout | `zh-CN` \| `zh-TW` \| `en-US` | navigator.language |
| settings | settings for layout | [`Settings`](#Settings) | - |
| siderWidth | width of the side menu | `number` | 208 |
| defaultCollapsed | The default collapsed and expanded menus, will be affected by `breakpoint`, `breakpoint=false` work | `boolean` | - |
| collapsed | Controls the collapse and expansion of the menu | `boolean` | - |
| onCollapse | The collapsed event of the menu | `(collapsed: boolean) => void` | - |
| onPageChange | Triggered on page switch | `(location: Location) => void` | - |
| headerRender | Custom header render method | `(props: ProLayoutProps) => ReactNode` | - |
| headerTitleRender | Custom header title method, works in mix mode | `(logo,title,props)=>ReactNode` | - |
| headerContentRender | Custom header content methods | `(props: ProLayoutProps) => ReactNode` | - |
| collapsedButtonRender | Custom method for collapsed button | `(collapsed: boolean) => ReactNode` | - |
| footerRender | Custom render method for footer | `(props: ProLayoutProps) => JSX.Element \| false` | - |
| pageTitleRender | The render method for custom page titles | `(props: ProLayoutProps) => ReactNode` | - |
| menuRender | The render method for custom menus | `(props: HeaderViewProps) => ReactNode` | - |
| postMenuData | View the menu data before displaying it, changes will not trigger a re-render | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| menuItemRender | The render method for custom menu items | [`(itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => ReactNode`](/components/layout/#menudataitem) | - |
| subMenuItemRender | Customize the render method with submenu items | [`(itemProps: MenuDataItem) => ReactNode`](/components/layout/#menudataitem) | - |
| menuDataRender | The render method of menuData, used to customize menuData | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| breadcrumbRender | customize the data for breadcrumbs | `(route)=>route` | - |
| route | Used to generate menus and breadcrumbs. umi's Layout will automatically have | [route](#route) | - |
| disableMobile | disable automatic switching to mobile pages | `boolean` | false |
| ErrorBoundary | Comes with error handling function to prevent blank screen. `ErrorBoundary=false` turn off default ErrorBoundary | `ReactNode` | default ErrorBoundary |
| links | Show shortcut actions in the lower right corner of the menu | `ReactNode[]` | - |
| menuProps | The props passed to the antd menu component, see (https://ant.design/components/menu/) | `MenuProps` | undefined |
| waterMarkProps | Configure watermark, watermark is a function of PageContainer, layout is only transparently transmitted to PageContainer | [WaterMarkProps](/components/water-mark) | - |

### SettingDrawer

| Parameters | Description | Type | Default Value |
| --- | --- | --- | --- |
| settings | layout settings | [`Settings`](#Settings) \| [`Settings`](#Settings) | - |
| onSettingChange | [`Settings`](#Settings) A change event occurred | `(settings: [`Settings`](#Settings)) => void` | - |
| hideHintAlert | Delete the prompt message below | `boolean` | - |
| hideCopyButton | Do not show copy function | `boolean` | - |
| disableUrlParams | Disable synchronization settings to query parameters | `boolean` | `false` |
| enableDarkTheme | Turn on black theme switching function ｜ `boolean` | `false` |
| colorList | Built-in color switching system ｜ `{key,color}[]` | `ColorList` |

Built-in color list

```tsx | pure
const colorList = [
  { key: 'daybreak', color: '#1890ff' },
  { key: 'dust', color: '#F5222D' },
  { key: 'volcano', color: '#FA541C' },
  { key: 'sunset', color: '#FAAD14' },
  { key: 'cyan', color: '#13C2C2' },
  { key: 'green', color: '#52C41A' },
  { key: 'geekblue', color: '#2F54EB' },
  { key: 'purple', color: '#722ED1' },
];
```

### PageLoading

A simple loading page

| parameters | description | type | default |
| --- | --- | --- | --- |
| [(...)](https://ant.design/components/spin-cn/#API) | support all other antd `Spin` component parameters | - | - |

### RouteContext

RouteContext can provide built-in data for Layout. For example, isMobile and collapsed, which you can consume to customize some of the behavior.

```tsx | pure
import { RouteContext, RouteContextType } from '@ant-design/pro-components';

const Page = () => (
  <RouteContext.
    {(value: RouteContextType) => {
      return value.title;
    }}
  </RouteContext.
);
```

### GridContent

GridContent encapsulates the [equal-width](https://preview.pro.ant.design/dashboard/analysis?layout=top&contentWidth=Fixed) and [flow](https://preview.pro. ant.design/dashboard/analysis?layout=top) logic. You can see the preview effect in [preview](https://preview.pro.ant.design/dashboard/analysis).

| parameters   | description | type               | default |
| ------------ | ----------- | ------------------ | ------- |
| contentWidth | ContentMode | `Fluid` \| `Fixed` | -       |

### getMenuData

Generate menuData and breadcrumb based on router information.

```js | pure import { getMenuData } from '@ant-design/pro-components';
const { breadcrumb, menuData } = getMenuData(routes, menu, formatMessage, menuDataRender);
```

| parameters | description | type | default |
| --- | --- | --- | --- |
| routes | The configuration information for the route | [route[]](#route) | - |
| menu | The configuration entry for menu, default `{locale: true}` | `{ locale: boolean }` | - |
| menuDataRender | The render method of menuData, used to customize menuData | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| formatMessage | The formatMessage method of react-intl | `(data: { id: any; defaultMessage?: string }) => string;` | - |

### getPageTitle

getPageTitle encapsulates the logic of the title generated on the menuData.

```js | pure
import { getPageTitle } from '@ant-design/pro-components';

const title = getPageTitle({
  pathname,
  breadcrumb,
  menu,
  title,
  formatMessage,
});
```

| parameters | description | type | default |
| --- | --- | --- | --- |
| pathname | current pathname | location.pathname | - |
| breadcrumb | the collection of MenuDataItem | `{ [path: string]: MenuDataItem }` | - |
| menu | The configuration item for menu, default `{locale: true}` | `{ locale: boolean }` | - |
| title | type of title | string | 'Ant Design Pro' |
| formatMessage | formatMessage method of react-intl | `(data: { id: any; defaultMessage?: string }) => string;` | - |

### Settings

```ts | pure
// You can get this type by importing { Settings } from '@ant-design/pro-layout/defaultSettings'
// to get this type
export interface Settings {
  /** Primary color of ant design */
  colorPrimary: string;
  /** Nav menu position: `side` or `top` */
  layout: 'side' | 'top';
  /** Layout of content: `Fluid` or `Fixed`, only works when layout is top */
  contentWidth: 'Fluid' | 'Fixed';
  /** Sticky header */
  fixedHeader: boolean;
  /** Sticky siderbar */
  fixSiderbar: boolean;
  menu: { locale: boolean };
  title: string;
  pwa: boolean;
  // Your custom iconfont Symbol script Url
  // eg: // at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  colorWeak: boolean;
}
```

### MenuDataItem

```ts | pure
// You can get this type by importing { MenuDataItem } from '@ant-design/pro-components'
// to get this type

export interface MenuDataItem {
  authority?: string[] | string;
  children?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  path: string;
  [key: string]: any;
}
```

### Route

```ts | pure
// You can get this type by importing { RouterTypes } from '@ant-design/pro-layout/lib/typings';
// to get this type
export interface Route {
  path: string;
  children: Array<{
    exact?: boolean;
    icon: string;
    name: string;
    path: string;
    // Optional secondary menu
    children?: Route['children'];
  }>;
}
```

### Footer

The default ProLayout does not provide a footer, but does provide a DefaultFooter component that supports the configuration of some hyperlinks and some copyright information.

```tsx | pure
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

<DefaultFooter
  copyright="@2019 by Anthem Experience Technologies"
  links={[
    {
      key: 'Ant Design Pro',
      title: 'Ant Design Pro',
      href: 'https://pro.ant.design',
      blankTarget: true,
    },
    {
      key: 'github',
      title: <GithubOutlined />,
      href: 'https://github.com/ant-design/ant-design-pro',
      blankTarget: true,
    },
    {
      key: 'Ant Design',
      title: 'Ant Design',
      href: 'https://ant.design',
      blankTarget: true,
    },
  ]}
/>;
```

### GridContent

GridContent is a simple syntactic sugar that encapsulates ProLayout's `contentWidth` configuration. `contentWidth`, if set to `Fixed` fixed-width mode, is only `1200px` at its widest.

Usage.

```tsx | pure
<GridContent>{children}</GridContent>
```

### RouteContext

RouteContext provides a way to perform operations based on the layout's data, PageContainer and FooterToolbar both rely on RouteContext's data for their functionality.

```tsx | pure
import { RouteContext, RouteContextType } from '@ant-design/pro-components';

const Page = () => (
  <RouteContext.
    {(value: RouteContextType) => {
      const { isMobile, hasHeader, hasSiderMenu, collapsed } = value;
      // The title of the user
      return value.title;
    }}
  </RouteContext.
);
```

## Token

Tokens are a basic element of a design system that allows you to quickly modify the underlying style of a component library using Tokens. These colors can be configured in Layout through the token property.

### Default token

The default token part comes from antd and may be changed, but here's the layout dependency.

| token | Description | The default value is |
| --- | --- | --- |
| colorPrimary | The main color is | `#1677FF` |
| colorError | Error color | `#ff4d4f` |
| colorSuccess | Success color | `#52c41a` |
| colorInfo | Notification color | `#1677FF` |
| colorWarning | Warning color | `#faad14` |
| colorTextHeading | Title color | `rgba(0, 0, 0, 0.85)` |
| colorText | Body color | `rgba(0, 0, 0, 0.65)` |
| colorTextSecondary | Secondary color | `rgba(0, 0, 0, 0.45)` |
| colorBorder | Border basic color | `#d9d9d9` |
| colorSplit | The color | that separates the border `rgba(0, 0, 0, 0.06)` |
| radiusBase | The default rounded corners | `4px` |

### The token of layout

| token | Description | The default value is |
| --- | --- | --- |
| bgLayout | Layout background color | `#f7f8fa` |
| colorTextAppListIcon | The icon color applied across sites is | `#666` |
| colorTextAppListIconHover | Icons applied across sites hover color | `rgba(0, 0, 0, 0.65)` |
| colorBgAppListIconHover | Icons for cross-site apps hover background color | `rgba(0, 0, 0, 0.04)` |

### Sider Token

Sider Token is the color value of the side menu, unlike the top menu.

| token | Description | The default value is |
| --- | --- | --- |
| colorMenuBackground | The background color of menu is | `transparent` |
| colorTextMenuTitle | The title font color of the sider is | `colorTextHeading` |
| colorMenuItemDivider | The color of the menuItem divider line | `colorSplit` |
| menuSubArrowColor | The arrow color of menuItem is | `rgba(0, 0, 0, 0.25)` |
| colorTextMenu | MenuItem's font color | `colorText` |
| colorTextMenuSecondary | Secondary font colors for menus, such as footers and icons for actions | `colorText` |
| colorTextMenuSelected | MenuItem has a selected font color | `rgb(0,0,0)` |
| colorBgMenuItemHover | menuItem's hover background color | `rgba(90, 75, 75, 0.03)` |
| colorBgMenuItemSelected | MenuItem's selected background color | `rgba(0, 0, 0, 0.04)` |
| colorBgMenuItemCollapsedHover | Collapse menuItem's hover background color | `rgba(0, 145, 255, 0.1)` |
| colorBgMenuItemCollapsedSelected | Collapse the selected background color | menuItem `rgba(0, 145, 255, 0.08)` |
| colorBgCollapsedButton | Expand the Collapse button background color | `#fff` |
| colorTextCollapsedButton | Expand the Collapse button hover font color | `colorTextMenuSecondary` |
| colorTextCollapsedButtonHover | Font color when the collapse button hover is expanded | `colorTextMenu` |

### Header Token

| token | Description | The default value is |
| --- | --- | --- |
| colorBgHeader | The background color of header is | `rgba(240, 242, 245, 0.4)` |
| colorHeaderTitle | The title font color of the sider is | `colorTextHeading` |
| colorTextMenu | MenuItem's font color | `colorText` |
| colorTextMenuSecondary | Secondary font colors for menus, such as footers and icons for actions | `colorText` |
| colorTextMenuSelected | MenuItem has a selected font color | `rgb(0,0,0)` |
| colorBgMenuItemHover | menuItem's hover background color | `rgba(90, 75, 75, 0.03)` |
| colorBgMenuItemSelected | MenuItem's selected background color | `rgba(0, 0, 0, 0.04)` |
| colorBgMenuItemCollapsedHover | Collapse menuItem's hover background color | `rgba(0, 145, 255, 0.1)` |
| colorBgMenuItemCollapsedSelected | Collapse the selected background color | menuItem `rgba(0, 145, 255, 0.08)` |
| colorTextRightActionsItem | Font color | in the upper-right corner `colorTextSecondary` |
| colorBgRightActionsItemHover | The hover color selected in the upper-right corner | `rgba(0, 0, 0, 0.03)` |

### pageContainer Token

| token | Description | The default value is |
| --- | --- | --- |
| marginBlockPageContainerContent | PageContainer comes with a margin | `#fff` |
| colorBgPageContainer | The background color of pageContainer is | `transparent` |
| colorBgPageContainerFixed | PageContainer is fixed when the background color | `#FFF` |

## FAQ

### Customizing Layout

ProLayout provides some api to remove areas that are not needed by the user. Some configurations are also provided in SettingDrawer to set them.

![setting-drawer-render](https://gw.alipayobjects.com/zos/antfincdn/mCXDkK2pJ0/60298863-F5A5-4af2-923A-13EF912DB0E1.png)

- `headerRender` can customize the top bar
- `footerRender` can customize the footer
- `menuRender` can customize the menu area
- `menuHeaderRender` Customizable menu header area
- `menuExtraRender` can add an extra content to the menu, between the menu header and the menu

> All xxxRender in layout can be passed in false to turn off rendering.

### Collapse to expand

Sometimes we find that `collapsed` and `onCollapse` do not work by default. This is because ProLayout has a built-in `breakpoint` mechanism to trigger collapse, we can set `breakpoint={false}` to turn off this mechanism.

### Customize the width of the menu

siderWidth can customize the width of the menu, you can set it shorter or longer FooterToolbar and other components will automatically support, but may need to do some style processing, otherwise the menu display may have some small problems.

The width of the menu is not customizable because it involves animation and huge amount of css changes, which is very difficult to customize.

### Auto-cut menu

Auto-cut menu is an exclusive ability of `mix` mode to place the first level of the menu into the top bar. We can set `splitMenus=true` to turn it on, and for a good experience it's best to set a redirect for each level of the menu, which will prevent switching to a white screen page.

![cutMenu](https://gw.alipayobjects.com/zos/antfincdn/H9hDMcrUh1/5438EB45-27F8-4B4F-8740-54F7BE55075C.png)

### Customizing menus

ProLayout will automatically generate the menu and auto-select it according to pathname. Combined with PageContainer, this allows for automatic breadcrumb and page title projection. If used with the umi configuration, you only need to hand the Page props to ProLayout to automatically generate the configuration of the menu based on the configuration of routers in config.

In order to provide more functionality, we extended the routers configuration by adding several configurations for customization, with the following data structure definition:

```ts | pure
// You can get this type by importing { MenuDataItem } from '@ant-design/pro-components'
// to get this type
export interface MenuDataItem {
  children?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  path: string;
  [key: string]: any;
}
```

- name is used to configure the name in the menu, and will be modified to the browser tab title
- icon represents the body of the menu, only antd's icon, iconfont needs to be defined by yourself
- locale can set the internationalization of the menu name
- hideInMenu will be configured to hide this route in the menu, name will have the same effect if not filled
- hideChildrenInMenu will hide the children of this route in the menu

> ProLayout actually reads the route and location from the props, which are injected by default by umi.

### Getting from the server

Sometimes we want the server to manage our routes, so we want the menus to be distributed by the server. We provide `menuDataRender` to modify the data, but note that `menuDataRender` will trigger re-rendering and will also support internationalization and permission configuration, so if you don't need internationalization, we recommend using `postMenuData` for a significant performance boost.

The server needs to return the same data as `MenuDataItem`, `menuDataRender` needs to return an array, if you want to have better performance you can try using the route property in props, here is a [demo](/components/layout#load-from-server-menu).
