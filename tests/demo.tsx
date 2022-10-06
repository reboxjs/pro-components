import '@testing-library/jest-dom';
import { act, cleanup, render as reactRender } from '@testing-library/react';
import glob from 'glob';
import MockDate from 'mockdate';
import { waitTime } from './util';
type Options = {
  skip?: boolean;
};

function demoTest(component: string, options: Options = {}) {
  const LINE_STR_COUNT = 20;
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  // Mock offsetHeight
  // @ts-expect-error
  const originOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  ).get;
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get() {
      let html = this.innerHTML;
      html = html.replace(/<[^>]*>/g, '');
      const lines = Math.ceil(html.length / LINE_STR_COUNT);
      return lines * 16;
    },
  });

  // Mock getComputedStyle
  const originGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (ele) => {
    const style = originGetComputedStyle(ele);
    style.lineHeight = '16px';
    return style;
  };

  afterEach(() => {
    logSpy.mockReset();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
    logSpy.mockReset();
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    });
    window.getComputedStyle = originGetComputedStyle;
  });
  // 支持 demos 下的所有非_开头的tsx文件
  const files = glob.sync(`./packages/${component}/**/demos/**/[!_]*.tsx`);
  files.push(...glob.sync(`./${component}/**/**/demos/[!_]*.tsx`));

  describe(`${component} demos`, () => {
    files.forEach((file) => {
      let testMethod = options.skip === true ? test.skip : test;
      if (Array.isArray(options.skip) && options.skip.some((c) => file.includes(c))) {
        testMethod = test.skip;
      }
      testMethod(`📸 renders ${file} correctly`, async () => {
        MockDate.set(1479828164000);
        const Demo = require(`.${file}`).default;
        const wrapper = reactRender(<Demo />);
        // Convert aria related content
        await act(async () => {
          await waitTime(2000);
        });
        expect(wrapper.asFragment()).toMatchSnapshot();

        wrapper.unmount();
        cleanup();
      });
    });
  });
}

export default demoTest;
