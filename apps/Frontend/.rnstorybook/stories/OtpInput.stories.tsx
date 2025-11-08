import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import OtpInput from '../../components/ui/otpInput';

const meta = {
  title: 'Components/OtpInput',
  component: OtpInput,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    otpLength: {
      description: 'The number of OTP input fields (default: 6)',
      control: { type: 'number', min: 4, max: 8 },
    },
    initial: {
      description: 'Initial value to pre-fill the OTP inputs',
      control: { type: 'text' },
    },
    onChangeOtp: {
      description: 'Callback function called when OTP value changes',
      action: 'onChangeOtp',
    },
  },
  args: {
    onChangeOtp: fn(),
  },
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    otpLength: 6,
    initial: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default 6-digit OTP input with empty initial value.',
      },
    },
  },
};

export const WithInitialValue: Story = {
  args: {
    otpLength: 6,
    initial: '123456',
  },
};

export const FourDigits: Story = {
  args: {
    otpLength: 4,
    initial: '',
  },
};

export const PartiallyFilled: Story = {
  args: {
    otpLength: 6,
    initial: '12',
  },
};