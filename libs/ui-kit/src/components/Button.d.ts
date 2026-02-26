import { type ButtonHTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (
  props?:
    | ({
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | null | undefined;
        size?: 'sm' | 'md' | 'lg' | 'icon' | null | undefined;
      } & import('class-variance-authority/types').ClassProp)
    | undefined
) => string;
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}
export declare const Button: any;
export { buttonVariants };
//# sourceMappingURL=Button.d.ts.map
