﻿import type { StepsFormProps } from '@ant-design/pro-form';
import { ProFormText, StepsForm } from '@ant-design/pro-form';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { Button } from 'antd';
import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../util';

describe('StepsForm', () => {
  it('🐲 basic use', async () => {
    const html = mount(
      <StepsForm>
        <StepsForm.StepForm title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
        <StepsForm.StepForm title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    expect(html.find('span.ant-steps-icon').length).toBe(3);
    expect(html.find('div.ant-steps-item-title').at(0).text()).toBe('表单1');
    expect(html.find('div.ant-steps-item-title').at(1).text()).toBe('表单2');
    expect(html.find('div.ant-steps-item-title').at(2).text()).toBe('表单3');
    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 stepsRender', async () => {
    const html = mount<StepsFormProps>(
      <StepsForm stepsRender={() => null}>
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="extraInfo" title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);

    expect(html.find('.ant-steps').exists()).toBeFalsy();

    act(() => {
      html.setProps({
        stepsRender: (_, dom) => <div id="test">{dom}</div>,
      });
    });
    await waitForComponentToPaint(html, 100);
    expect(html.find('.ant-steps').exists()).toBeTruthy();
    expect(html.find('div#test').exists()).toBeTruthy();
    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 pre button ', async () => {
    const onCurrentChange = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(current) => {
          onCurrentChange(current);
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="extraInfo" title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html, 100);
    act(() => {
      html.find('button.ant-btn').at(0).simulate('click');
    });
    expect(onCurrentChange).toBeCalledWith(0);
    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 async onFinish', async () => {
    const fn = jest.fn();
    const currentFn = jest.fn();
    const onFinish = jest.fn();

    const html = render(
      <StepsForm onCurrentChange={currentFn} onFinish={onFinish}>
        <StepsForm.StepForm
          name="base"
          title="表单1"
          onFinish={async (values) => {
            fn(values);
            return true;
          }}
        >
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);

    await act(async () => {
      (await html.findByText('下一步')).click();
    });

    await waitForComponentToPaint(html);

    expect(fn).toBeCalled();
    expect(currentFn).toBeCalled();

    await act(async () => {
      (await html.findByText('提 交')).click();
    });
    await waitForComponentToPaint(html);

    expect(onFinish).toBeCalled();
    expect(fn).toBeCalled();
    expect(currentFn).toBeCalled();

    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 submit when onFinish is null', async () => {
    const fn = jest.fn();
    const currentFn = jest.fn();

    const html = mount<StepsFormProps>(
      <StepsForm onCurrentChange={currentFn}>
        <StepsForm.StepForm
          name="base"
          title="表单1"
          onFinish={async (values) => {
            fn(values);
            return true;
          }}
        >
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(html);

    expect(fn).toBeCalled();
    expect(currentFn).toBeCalled();

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 onFinish return true', async () => {
    const fn = jest.fn();
    const currentFn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(c) => {
          currentFn(c);
        }}
        onFinish={async (values) => {
          fn(values);
          return true;
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );

    await waitForComponentToPaint(html);
    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(html);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    expect(fn).toBeCalled();
    expect(currentFn).toBeCalledWith(0);

    await waitForComponentToPaint(html, 1200);
    html.unmount();
  });

  it('🐲 onFinish throw error', async () => {
    const currentFn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(c) => {
          currentFn(c);
        }}
        onFinish={async () => {
          throw new Error('发生了错误');
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );

    await waitForComponentToPaint(html);
    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(html);
    expect(currentFn).not.toBeCalledWith(0);

    html.unmount();
  });

  it('🐲 submitter render=false', () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        submitter={{
          render: false,
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );

    expect(html.find('button.ant-btn.ant-btn-primary').exists()).toBeFalsy();
  });

  it('🐲 submitter render props', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(current) => fn(current)}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onPre?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    expect(html.find('button#rest').exists()).toBeTruthy();

    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledWith(0);

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 current min=0', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={0}
        onCurrentChange={(current) => {
          fn(current);
        }}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onReset?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    /** 因为上一步有限制，所以应该不触发 */
    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledTimes(0);

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 current max=1', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(current) => {
          fn(current);
        }}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onSubmit?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    /** 因为下一步有限制，所以应该不触发 */
    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledTimes(0);

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 submitter=false', async () => {
    const html = mount<StepsFormProps>(
      <StepsForm submitter={false}>
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    expect(
      html.find('.ant-pro-steps-form-step-active button.ant-btn.ant-btn-primary').exists(),
    ).toBeFalsy();
    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 submitter render function', async () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        submitter={{
          render: () => {
            return (
              <Button id="next" key="next">
                下一步
              </Button>
            );
          },
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );

    expect(html.find('button#next').exists()).toBeTruthy();

    await waitForComponentToPaint(html, 100);
    html.unmount();
  });

  it('🐲 support stepsFormRender', async () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        stepsFormRender={(dom, submitter) => {
          return (
            <div>
              <div id="content">{dom}</div>
              <div id="footer">{submitter} </div>
            </div>
          );
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    expect(html.find('#content form').length).toBe(2);
    expect(html.find('#content form').exists()).toBeTruthy();
    expect(html.find('#footer button').exists()).toBeTruthy();

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 support stepsFormRender', async () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        stepFormRender={(dom) => {
          return <div id="content">{dom}</div>;
        }}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);
    expect(html.find('#content').length).toBe(1);
    expect(html.find('form #content').length).toBe(1);
    expect(html.find('form').length).toBe(2);
    expect(html.find('form #content').exists()).toBeTruthy();

    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 support deepmerge form value', async () => {
    const submit = jest.fn(() => Promise.resolve());
    const html = render(
      <StepsForm
        stepFormRender={(dom) => {
          return <div id="content">{dom}</div>;
        }}
        onFinish={submit}
      >
        <StepsForm.StepForm name="base" title="表单1">
          <ProFormText name={['info', 'name']} initialValue={'chenshuai'} />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="moreInfo" title="表单2">
          <ProFormText name={['info', 'age']} initialValue={'22'} />
        </StepsForm.StepForm>
      </StepsForm>,
    );
    await waitForComponentToPaint(html, 200);
    await act(async () => {
      (await html.findByText('下一步')).click();
    });

    await waitForComponentToPaint(html, 200);

    await act(async () => {
      (await html.findByText('提 交')).click();
    });

    await waitForComponentToPaint(html);
    expect(submit).toBeCalledWith({
      info: {
        name: 'chenshuai',
        age: '22',
      },
    });
  });

  it('🐲 properly unregister form', async () => {
    const Forms = () => {
      const [show, setShow] = React.useState(true);
      return (
        <StepsForm>
          <StepsForm.StepForm name="step1" title="表单1">
            表单 1
            <button type="button" onClick={() => setShow(false)}>
              隐藏表单3
            </button>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title="表单2">
            表单 2
          </StepsForm.StepForm>
          {show ? (
            <StepsForm.StepForm name="step3" title="表单3">
              表单 3
            </StepsForm.StepForm>
          ) : null}
        </StepsForm>
      );
    };
    const html = render(<Forms />);
    await waitForComponentToPaint(html);
    expect(html.container.querySelectorAll('.ant-steps-item')).toHaveLength(3);
    await act(async () => {
      (await html.findByText('隐藏表单3')).click();
    });
    expect(html.container.querySelectorAll('.ant-steps-item')).toHaveLength(2);
  });
});
