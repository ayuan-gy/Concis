import { CSSProperties, ReactNode } from 'react';

interface groupProps {
  children?: ReactNode;
  /**
   * @description 类名
   */
  className?: string;
  /**
   * @description 按钮组头像大小
   */
  size?: number;
  /**
   * @description 按钮组样式
   */
  groupStyle?: CSSProperties;
}
interface avatarProps {
  children?: ReactNode;
  /**
   * @description 类名
   */
  className?: string;
  /**
   * @description 头像自定义样式
   * @default {}
   */
  style?: CSSProperties;
  /**
   * @description 头像大小
   * @default 40px
   */
  size?: number;
  /**
   * @description 头像形状
   * @default circle
   */
  shape?: string;
  /**
   * @description 文本自适应
   * @default true
   */
  autoFixFontSize?: boolean;
  /**
   * @description 交互类型
   * @default button
   */
  triggerType?: 'mask' | 'button';
  /**
   * @description 交互按钮图标
   * @default <></>
   */
  triggerIcon?: ReactNode;
  /**
   * @description 交互点击回调
   */
  triggerClick?: Function;
}

export type { groupProps, avatarProps };
