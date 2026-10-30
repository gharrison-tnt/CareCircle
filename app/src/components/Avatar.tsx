import type { AvatarClass } from '../types';

interface AvatarProps {
  initials: string;
  avClass: AvatarClass;
  size?: number;
  fontSize?: number;
}

export function Avatar({ initials, avClass, size, fontSize }: AvatarProps) {
  const style = size ? { width: size, height: size, fontSize: fontSize ?? size * 0.3 } : undefined;
  return (
    <div className={`avatar ${avClass}`} style={style}>
      {initials}
    </div>
  );
}
