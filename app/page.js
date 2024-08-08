'use client';
import SignUpPage from "./signup/page";
import SignInPage from "./signin/page";
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();

  if (pathname === '/signin'){
    return <SignInPage />;
  }

  if (pathname == '/signup'){
    return <SignUpPage />;
  }

  return <SignUpPage />;
};

export default Page;
