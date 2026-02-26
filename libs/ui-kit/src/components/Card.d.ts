import type { ReactNode } from 'react';
export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}
export declare function Card({
  children,
  className,
  variant,
}: CardProps): import('react').JSX.Element;
export declare function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): import('react').JSX.Element;
export declare function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): import('react').JSX.Element;
export declare function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): import('react').JSX.Element;
export declare function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): import('react').JSX.Element;
export declare function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): import('react').JSX.Element;
//# sourceMappingURL=Card.d.ts.map
