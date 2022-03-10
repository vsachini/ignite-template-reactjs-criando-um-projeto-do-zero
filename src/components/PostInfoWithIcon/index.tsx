import { createElement } from 'react';
import { IconType } from 'react-icons';
import styles from './postInfoWithIcon.module.scss';

interface PostInfoWithIconProps {
  icon: IconType;
  text: string;
}

export default function PostInfoWithIcon({
  icon,
  text,
}: PostInfoWithIconProps) {
  return (
    <div className={styles.details}>
      {createElement(icon)}
      <span>{text}</span>
    </div>
  );
}
