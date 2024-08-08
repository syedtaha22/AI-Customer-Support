'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Box, Container, Grid, Accordion, AccordionSummary, AccordionDetails, Link, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Assistant from '@mui/icons-material/Assistant';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';


// Custom SVG Icons
function BotIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="30"
			height="30"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 8V4H8" />
			<rect width="16" height="12" x="4" y="8" rx="2" />
			<path d="M2 14h2" />
			<path d="M20 14h2" />
			<path d="M15 13v2" />
			<path d="M9 13v2" />
		</svg>
	);
}

function FeatureCard({ icon, title, description }) {
	return (
		<Grid item xs={12} sm={6} lg={4}>
			<Card sx={{
				textAlign: 'center',
				boxShadow: 5,
				background: 'linear-gradient(145deg, #2a2a2a, #1c1c1c)',
				borderRadius: 4,
				transition: 'transform 0.3s ease',
				'&:hover': { transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)' }
			}}>
				<CardContent sx={{ p: 2 }}>
					{icon}
					<Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 2 }}>{title}</Typography>
					<Typography variant="body1" color="white">
						{description}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}

const features = [
	{
		icon: <Assistant style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Conversational Support',
		description: 'Our AI assistant can engage in natural language conversations to provide personalized support.'
	},
	{
		icon: <SearchIcon style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Knowledge Base Search',
		description: 'Quickly find answers to your questions by searching our extensive knowledge base.'
	},
	{
		icon: <AutoAwesome style={{ fontSize: 30, marginBottom: 10, color: 'white' }} />,
		title: 'Personalized Recommendations',
		description: 'Our AI assistant can provide personalized product recommendations and support based on your needs.'
	}
];

const LandingPage = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const router = useRouter();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSignIn = () => {
		router.push('/signin');
	};

	const handleSignUp = () => {
		router.push('/signup');
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<AppBar position="static" sx={{ backgroundColor: '#121212' }}>
				<Toolbar>
					<Link href="#" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
						<BotIcon />
						<Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: 'white' }}>AI Assistant</Typography>
					</Link>
					<Box sx={{ flexGrow: 1 }} />
					{isMobile ? (
						<>
							<IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
								<MenuIcon />
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								sx={{ '& .MuiPaper-root': { backgroundColor: '#121212' } }}
							>
								<MenuItem onClick={handleSignIn} component="a" href="#" sx={{ color: 'white' }}>Sign In</MenuItem>
								<MenuItem onClick={handleSignUp} component="a" href="#" sx={{ color: 'white' }}>Sign Up</MenuItem>
							</Menu>
						</>
					) : (
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Button
								onClick={handleSignIn}

								sx={{
									mr: 2,
									color: '#9a9a9a',
									textTransform: 'none',
									'&:hover': {
										color: '#ffffff'
									}

								}}
								href="#"
							>
								Sign In
							</Button>
							<Button
								onClick={handleSignUp}
								variant="outlined"
								sx={{
									borderColor: '#9a9a9a',
									color: '#121212',
									textTransform: 'none',
									backgroundColor: '#ffffff',
									'&:hover': {
										color: 'white',
										borderColor: '#121212',
										backgroundColor: '#313131'
									}
								}}
								href="#"
							>
								Sign Up
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>


			<Box
				component="main"
				sx={{
					flex: 1,
					background: '#121212',
					color: 'white',
					textAlign: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					py: { xs: 10, md: 15 },
				}}
			>
				<Container maxWidth="md">
					<Typography variant="h3" fontWeight="bold" gutterBottom>
						Effortless Customer Service with AI
					</Typography>
					<Typography variant="h6" sx={{ mb: 4 }}>
						Our AI-powered assistant is here to help you with all your customer service needs. Get instant answers and personalized support.
					</Typography>
					<Button
						onClick={handleSignUp}
						variant="contained"
						size="large"
						sx={{
							textTransform: 'none',
							color: '#121212',
							border: '2px solid white',
							background: 'white',
							'&:hover': {
								background: 'white',
								background: 'var(--primary)', // Keep the background color unchanged
								border: '2px solid #121212', // Change only the border color
								color: 'white'
							},
						}}
					>
						Get Started
					</Button>
				</Container>
			</Box>

			{/* AI Capabilities Section */}
			<Box sx={{ py: 10, background: '#1e1e1e', color: 'white' }}>
				<Container maxWidth="lg">
					<Typography color="white" variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
						AI Capabilities
					</Typography>
					<Box sx={{ mb: 6 }} /> {/* Additional space between heading and cards */}
					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<FeatureCard key={index} {...feature} />
						))}
					</Grid>
				</Container>
			</Box>

			{/* FAQ Section */}
			<Box sx={{ py: 10, background: '#121212', color: 'white' }}>
				<Container maxWidth="md">
					<Typography color="white" variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
						Project Contributors
					</Typography>
					<Accordion sx={{ background: '#1f1f1f', borderRadius: '12px', marginBottom: '16px', marginTop: '25px' }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
							<Typography variant="h6" fontWeight="medium" color="white">Syed Muhammad Taha</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body2" color="white" sx={{ fontSize: '1.1rem' }}>
								Engineered the core chatbot logic, enabling intelligent and engaging conversations with users.
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion sx={{ background: '#1f1f1f', borderRadius: '12px', marginBottom: '16px' }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
							<Typography variant="h6" fontWeight="medium" color="white">Ammar Bin Aamir Khan</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body2" color="white" sx={{ fontSize: '1.1rem' }}>
								Developed the robust and user-friendly sign-in and sign-up functionalities, including seamless Google authentication integration.
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion sx={{ background: '#1f1f1f', borderRadius: '12px', marginBottom: '16px' }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
							<Typography variant="h6" fontWeight="medium" color="white">Rashid Hussain</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body2" color="white" sx={{ fontSize: '1.1rem' }}>
								Crafted the visually appealing and informative landing page, effectively introducing the project to visitors.
							</Typography>
						</AccordionDetails>
					</Accordion>
				</Container>
			</Box>

			{/* Footer */}
			<Box component="footer" sx={{ backgroundColor: '#121212', py: 4 }}>
				<Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
					<Link href="#" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
						<BotIcon />
						<Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: 'white' }}>AI Assistant</Typography>
					</Link>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Link href="https://syedtaha.org/" sx={{ display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}>
							<Avatar src="/taha.jpg" alt="Profile Picture" sx={{ width: 40, height: 40 }} />
						</Link>
						<Link href="https://ammar-khan18.github.io/Portfolio-Website/" sx={{ display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}>
							<Avatar src="/ammar.jpg" alt="Profile Picture" sx={{ width: 40, height: 40 }} />
						</Link>
						<Link href="https://rh29152.github.io/Landing-page/" sx={{ display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}>
							<Avatar src="/rashid.jpg" alt="Profile Picture" sx={{ width: 40, height: 40 }} />
						</Link>
					</Box>
				</Container>
			</Box>
		</Box >
	);
}

export default LandingPage;