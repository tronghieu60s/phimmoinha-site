import { notification } from 'antd';
import { ArgsProps, NotificationPlacement } from 'antd/lib/notification';

export const notificationInfo = (
  message: string,
  placement: NotificationPlacement = 'topRight',
  options: ArgsProps = { message: 'Notification Info' },
) => {
  notification.info({
    placement,
    description: message || 'Information',
    ...options,
  });
};

export const notificationError = (
  message: string,
  placement: NotificationPlacement = 'topRight',
  options: ArgsProps = { message: 'Notification Error' },
) => {
  notification.error({
    placement,
    description: message || 'Failed! Please try again later.',
    ...options,
  });
};

export const notificationSuccess = (
  message: string,
  placement: NotificationPlacement = 'topRight',
  options: ArgsProps = { message: 'Notification Success' },
) => {
  notification.success({
    placement,
    description: message || 'Succeed! The action is done successfully.',
    ...options,
  });
};

export const notificationWarning = (
  message: string,
  placement: NotificationPlacement = 'topRight',
  options: ArgsProps = { message: 'Notification Warning' },
) => {
  notification.warn({
    placement,
    description: message || 'Warning! The action is not done successfully.',
    ...options,
  });
};
