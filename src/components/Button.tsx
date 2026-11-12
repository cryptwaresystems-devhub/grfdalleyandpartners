import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

type Appearance = { variant?: 'primary' | 'outline' | 'light'; arrow?: boolean; children: ReactNode; className?: string };
function classes(variant: Appearance['variant'] = 'primary', className = '') {
  return `button button--${variant} ${className}`.trim();
}
function Content({ children, arrow }: Pick<Appearance, 'children' | 'arrow'>) {
  return <>{children}{arrow && <ArrowUpRight size={17} aria-hidden="true" />}</>;
}
export function Button({ children, variant, arrow, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & Appearance) {
  return <button {...props} type={type} className={classes(variant, className)}><Content arrow={arrow}>{children}</Content></button>;
}
export function ButtonLink({ children, variant, arrow, className, ...props }: LinkProps & Appearance) {
  return <Link {...props} className={classes(variant, className)}><Content arrow={arrow}>{children}</Content></Link>;
}
