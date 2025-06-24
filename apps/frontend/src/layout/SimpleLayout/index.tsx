'use client';

import { usePathname } from 'next/navigation';

// project-import
import { SimpleLayoutType } from 'config';

import FooterBlock from './FooterBlock';
import Header from './Header';

interface Props {
  // ==============================|| LAYOUTS - STRUCTURE ||============================== //

  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const layout: string =
    pathname === 'landing' || pathname === '/'
      ? SimpleLayoutType.LANDING
      : SimpleLayoutType.SIMPLE;

  return (
    <>
      <Header />
      {children}
      <FooterBlock isFull={layout === SimpleLayoutType.LANDING} />
    </>
  );
}
