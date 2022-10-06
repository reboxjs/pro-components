import { SettingDrawer } from '@ant-design/pro-components';
import { act, render as reactRender } from '@testing-library/react';
import { mount, render } from 'enzyme';
import { waitForComponentToPaint } from '../util';
import { defaultSettings } from './defaultSettings';

describe('settingDrawer.test', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'TEST';
    process.env.USE_MEDIA = 'md';

    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4437.0 Safari/537.36 Edg/91.0.831.1',
        clipboard: {
          writeText: async () => {
            return true;
          },
        },
      },
    });
  });
  beforeEach(() => {
    // @ts-expect-error
    window.MutationObserver = null;
  });

  it('🌺 base user', () => {
    const html = render(
      <SettingDrawer disableUrlParams settings={defaultSettings} getContainer={false} collapse />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🌺 settings = undefined', () => {
    const html = render(
      <SettingDrawer disableUrlParams settings={undefined as any} getContainer={false} collapse />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🌺 hideColors = true', () => {
    const html = render(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        colorList={false}
        getContainer={false}
        collapse
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🌺 colorList key is undefined', () => {
    render(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        colorList={[
          {
            key: '',
            color: 'red',
          },
        ]}
        getContainer={false}
        collapse
      />,
    );
  });

  it('🌺  theme color Change', async () => {
    const onSettingChange = jest.fn();
    const colorList = [
      { key: 'dust', color: '#F5222D' },
      { key: 'volcano', color: '#FA541C' },
      { key: 'sunset', color: '#FAAD14' },
      { key: 'cyan', color: '#13C2C2' },
      { key: 'green', color: '#52C41A' },
      { key: 'geekblue', color: '#2F54EB' },
      { key: 'purple', color: '#722ED1' },
      { key: 'qixian', color: '#F52225' },
      { key: 'test', color: '#722ED2' },
    ];
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        colorList={colorList}
        settings={defaultSettings}
        collapse
        getContainer={false}
        onSettingChange={(setting) => onSettingChange(setting.colorPrimary)}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-theme-color-block').at(0);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith('#1677FF');

    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-theme-color-block').at(1);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(onSettingChange).toBeCalledWith('#F5222D');
    expect(wrapper.find('div.ant-pro-setting-drawer-theme-color-block').length).toBe(9);
    act(() => {
      wrapper.unmount();
    });
  });

  it('🌺 hideHintAlert = true', () => {
    const html = render(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        hideHintAlert
        getContainer={false}
        collapse
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🌺 initState form query', async () => {
    const fn = jest.fn();
    const html = mount(
      <div>
        <SettingDrawer
          disableUrlParams={false}
          getContainer={false}
          collapse
          onSettingChange={(setting) => {
            fn(setting);
          }}
        />
      </div>,
    );
    await waitForComponentToPaint(html);

    act(() => {
      html.find('.ant-btn.ant-btn-block').simulate('click');
    });

    await waitForComponentToPaint(html);

    act(() => {
      html.find('div.ant-drawer-mask').simulate('click');
    });

    await waitForComponentToPaint(html, 1000);

    expect(fn).toBeCalled();
    expect(fn).toBeCalledWith({
      navTheme: 'realDark',
      layout: 'mix',
      contentWidth: 'Fluid',
      fixedHeader: true,
      fixSiderbar: true,
      colorPrimary: '#1677FF',
      splitMenus: false,
    });
    html.unmount();
  });

  it('🌺 hideCopyButton = true', () => {
    const html = render(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        hideCopyButton
        getContainer={false}
        collapse
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('🌺 clipboard throw error', async () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4437.0 Safari/537.36 Edg/91.0.831.1',
        clipboard: {
          writeText: async () => {
            throw new Error('error');
          },
        },
      },
    });
    const fn = jest.fn();
    const html = mount(
      <SettingDrawer
        disableUrlParams
        getContainer={false}
        collapse
        onSettingChange={() => {
          fn();
        }}
      />,
    );
    await waitForComponentToPaint(html);

    act(() => {
      html.find('.ant-btn.ant-btn-block').simulate('click');
    });
    await waitForComponentToPaint(html);
    expect(fn).toBeCalled();
    html.unmount();
  });

  it('🌺 onCollapseChange', async () => {
    const onCollapseChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        settings={{
          ...defaultSettings,
          // @ts-ignore
          menuRender: true,
          footerRender: false,
        }}
        collapse
        getContainer={false}
        onCollapseChange={onCollapseChange}
      />,
    );
    await waitForComponentToPaint(wrapper);
    const button = wrapper.find('.ant-pro-setting-drawer-handle');
    act(() => {
      button.simulate('click');
    });
    expect(onCollapseChange).toHaveBeenCalled();
  });

  it('🌺 onLayout Change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        collapse
        getContainer={false}
        onSettingChange={(setting) => onSettingChange(setting.layout)}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-block-checkbox-layout-item').at(2);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith('mix');

    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-block-checkbox-layout-item').at(1);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(onSettingChange).toBeCalledWith('top');
  });

  it('🌺 fix-siderbar Change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        collapse
        getContainer={false}
        onSettingChange={(setting) => {
          onSettingChange(setting.fixSiderbar);
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.fix-siderbar').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(true);

    act(() => {
      wrapper.find('button.fix-siderbar').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(false);
  });

  it('🌺 content-width change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        collapse
        settings={{
          layout: 'top',
        }}
        getContainer={false}
        onSettingChange={(setting) => {
          onSettingChange(setting.contentWidth);
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper
        .find('div.ant-select.content-width')
        .find('.ant-select-selector')
        .simulate('mousedown');
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith('Fluid');
  });

  it('🌺 splitMenu change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        collapse
        settings={{
          layout: 'mix',
        }}
        getContainer={false}
        onSettingChange={(setting) => {
          onSettingChange(setting.splitMenus);
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.split-menus').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(onSettingChange).toBeCalledWith(true);
  });

  it('🌺 fixed-header Change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        collapse
        getContainer={false}
        onSettingChange={(setting) => {
          onSettingChange(setting.fixedHeader);
        }}
      />,
    );

    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.fixed-header').simulate('click');
    });

    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(true);

    act(() => {
      wrapper.find('button.fixed-header').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(false);
  });

  it('🌺 theme Change', async () => {
    const onSettingChange = jest.fn();
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        settings={defaultSettings}
        collapse
        enableDarkTheme
        getContainer={false}
        onSettingChange={(setting) => onSettingChange(setting.navTheme)}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-block-checkbox-theme-item').at(0);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith('light');

    act(() => {
      const button = wrapper.find('div.ant-pro-setting-drawer-block-checkbox-theme-item').at(1);
      button.simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(onSettingChange).toBeCalledWith('realDark');
  });

  it('🌺 colorWeak Change', async () => {
    const onSettingChange = jest.fn();
    document.body.appendChild(document.createElement('div'));
    const wrapper = mount(
      <SettingDrawer
        disableUrlParams
        colorList={[]}
        settings={{ ...defaultSettings, navTheme: 'realDark', menuRender: false }}
        collapse
        getContainer={false}
        onSettingChange={(setting) => {
          onSettingChange(setting.colorWeak);
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.color-weak').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(true);

    act(() => {
      wrapper.setProps({
        settings: {
          ...defaultSettings,
          colorWeak: true,
        },
      });
    });
    await waitForComponentToPaint(wrapper, 200);
    act(() => {
      wrapper.find('button.color-weak').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onSettingChange).toBeCalledWith(false);
  });
  ['header', 'footer', 'menu', 'menuHeader'].map((key) => {
    it(`🌺 ${key} regional config change`, async () => {
      const fn = jest.fn();
      const html = mount(
        <SettingDrawer
          disableUrlParams
          onSettingChange={(s) => {
            if (s[`${key}Render`] === false) {
              fn(key);
            }
          }}
          getContainer={false}
          collapse
        />,
      );
      await waitForComponentToPaint(html, 200);

      act(() => {
        if (html.find(`.regional-${key}`).exists()) {
          html.find(`button.regional-${key}`).simulate('click');
        }
      });
      expect(fn).toBeCalledWith(key);

      act(() => {
        html.unmount();
      });
    });
  });

  it('🌺 onLanguageChange support', async () => {
    let fn: Function | null = null;
    const addEventListenerSpy = jest
      .spyOn(document, 'addEventListener')
      .mockImplementation((eventName, eventFn) => {
        if (eventName === 'languagechange') {
          //@ts-expect-error
          fn = eventFn;
        }
      });
    const html = reactRender(
      <SettingDrawer disableUrlParams settings={defaultSettings} getContainer={false} collapse />,
    );
    const { rerender } = html;
    await waitForComponentToPaint(html, 200);
    act(() => {
      expect(
        (
          html.baseElement.querySelectorAll(
            '.ant-pro-setting-drawer-body-title',
          )[0] as HTMLHeadingElement
        ).textContent,
      ).toEqual('整体风格设置');
    });
    act(() => {
      window.localStorage.setItem('umi_locale', 'en-US');
    });
    await waitForComponentToPaint(html, 1200);
    act(() => {
      fn?.();
      rerender(
        <SettingDrawer disableUrlParams settings={defaultSettings} getContainer={false} collapse />,
      );
    });
    addEventListenerSpy.mockRestore();
    await waitForComponentToPaint(html, 1200);
    act(() => {
      expect(
        (
          html.baseElement.querySelectorAll(
            '.ant-pro-setting-drawer-body-title',
          )[0] as HTMLHeadingElement
        ).textContent,
      ).toEqual('Page style setting');
    });
    await waitForComponentToPaint(html, 200);
    html.unmount();
    window.localStorage.setItem('umi_locale', 'zh-CN');
  });
});
