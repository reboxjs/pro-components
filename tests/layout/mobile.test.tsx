﻿import { ProLayout } from '@ant-design/pro-layout';
import { render as reactRender, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../util';
import defaultProps from './defaultProps';

describe('mobile BasicLayout', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'TEST';
    process.env.USE_MEDIA = 'xs';

    Object.defineProperty(global.window, 'matchMedia', {
      value: jest.fn((query) => {
        //  (max-width: 575px)
        return {
          media: query,
          matches: query.includes('max-width: 575px'),
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      }),
    });
  });

  afterAll(() => {
    process.env.USE_MEDIA = 'md';
    process.env.NODE_ENV = 'dev';
  });

  it('📱 base use', async () => {
    const html = render(<ProLayout {...defaultProps} getContainer={false} onCollapse={() => {}} />);
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 collapsed=false', async () => {
    const html = render(<ProLayout {...defaultProps} getContainer={false} collapsed={false} />);
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout=mix', async () => {
    const html = render(
      <ProLayout {...defaultProps} getContainer={false} layout="mix" collapsed={false} />,
    );
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout=mix and splitMenus', async () => {
    const html = render(
      <ProLayout
        {...defaultProps}
        splitMenus
        getContainer={false}
        layout="mix"
        collapsed={false}
      />,
    );
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout menuHeaderRender=false', async () => {
    const html = render(
      <ProLayout
        {...defaultProps}
        collapsed
        getContainer={false}
        layout="mix"
        menuHeaderRender={false}
      />,
    );
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout menuHeaderRender', async () => {
    const html = render(
      <ProLayout
        {...defaultProps}
        collapsed
        getContainer={false}
        layout="mix"
        menuHeaderRender={() => 'title'}
      />,
    );
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout menuHeaderRender', async () => {
    const html = render(
      <ProLayout
        {...defaultProps}
        collapsed
        getContainer={false}
        layout="mix"
        menuHeaderRender={() => 'title'}
      />,
    );
    expect(html.asFragment()).toMatchSnapshot();
  });

  it('📱 layout collapsedButtonRender', async () => {
    const onCollapse = jest.fn();
    const html = reactRender(
      <ProLayout
        {...defaultProps}
        onCollapse={onCollapse}
        collapsed={false}
        collapsedButtonRender={() => {
          return 'div';
        }}
        getContainer={false}
        layout="mix"
      />,
    );

    waitForComponentToPaint(html);
    act(() => {
      html.baseElement
        ?.querySelector<HTMLSpanElement>('span.ant-pro-global-header-collapsed-button')
        ?.click();
    });
    waitForComponentToPaint(html);
    act(() => {
      html.baseElement?.querySelector<HTMLDivElement>('div.ant-drawer-mask')?.click();
    });
    waitForComponentToPaint(html);
    expect(onCollapse).toHaveBeenCalled();

    waitForComponentToPaint(html);
    html.unmount();
  });
});
