'use client';
import LandingPage from "./LandingPage/page"
import SignUpPage from "./signup/page";
import SignInPage from "./signin/page";
import { usePathname } from 'next/navigation';

// TO DO - Add Google auth form firebase
const Page = () => {
	const pathname = usePathname();

	if (pathname === '/signin') {
		return <SignInPage />;
	}

	if (pathname == '/signup') {
		return <SignUpPage />;
	}

	return <LandingPage />;
};

export default Page;


