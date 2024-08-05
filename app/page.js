'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, ThemeProvider, createTheme, Menu, MenuItem, IconButton, AppBar, Toolbar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Import dark theme for syntax highlighting
import 'highlight.js/styles/github.css'; // Import light theme for syntax highlighting
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatIcon from '@mui/icons-material/Chat';

// Function to create a MUI theme based on the selected mode ('light' or 'dark')
const getTheme = (mode) =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'dark' ? '#0B1215' : '#f5f5f5',
				paper: mode === 'dark' ? '#0B1215' : '#f5f5f5',
			},
			primary: {
				main: '#1E88E5',
			},
			secondary: {
				main: '#E91E63',
			},
			text: {
				primary: mode === 'dark' ? '#E0E0E0' : '#000',
				secondary: mode === 'dark' ? '#B0B0B0' : '#333',
			},
		},
		components: {
			// Style overrides for the MUI TextField component
			MuiTextField: {
				styleOverrides: {
					root: {
						'& .MuiOutlinedInput-root': {
							borderRadius: 20,
							'&.Mui-focused fieldset': {
								borderColor: mode === 'dark' ? '#E0E0E0' : '#000',
							},
						},
					},
				},
			},
			// Style overrides for the MUI Button component
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 20,
					},
				},
			},
			// Style overrides for code blocks
			MuiTypography: {
				styleOverrides: {
					root: {
						// Custom styles for pre and code elements
						'& pre': {
							backgroundColor: mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
							color: mode === 'dark' ? '#dcdcdc' : '#333333',
							padding: '1em',
							borderRadius: '4px',
							overflowX: 'auto',
							whiteSpace: 'pre-wrap',
							marginBottom: '1em',
							border: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`,
						},
						'& code': {
							backgroundColor: mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
							padding: '0.2em 0.4em',
							borderRadius: '4px',
							color: mode === 'dark' ? '#dcdcdc' : '#333333',
							fontSize: '0.9em',
							border: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`,
						},
					},
				},
			},
		},
	});


// Main component for the chat page
export default function Page() {
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
		},
	]);
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [mode, setMode] = useState('dark'); // State to manage the theme mode ('dark' or 'light')
	const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element

	// Function to send a message and handle the API request
	const sendMessage = async () => {
		if (!message.trim() || isLoading) return; // Prevent sending empty messages or while loading
		setIsLoading(true);

		// Add user message and placeholder for assistant response
		setMessages((messages) => [
			...messages,
			{ role: 'user', content: message },
			{ role: 'assistant', content: '' },
		]);

		setMessage('');

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify([...messages, { role: 'user', content: message }]),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const text = decoder.decode(value, { stream: true });
				setMessages((messages) => {
					let lastMessage = messages[messages.length - 1];
					let otherMessages = messages.slice(0, messages.length - 1);
					return [
						...otherMessages,
						{ ...lastMessage, content: lastMessage.content + text },
					];
				});
			}
		} catch (error) {
			console.error('Error:', error);
			setMessages((messages) => [
				...messages,
				{ role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
			]);
		}

		setIsLoading(false);
	};

	// Handle Enter key press to send message
	const handleKeyPress = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	// Reference for scrolling to bottom of message list
	const messagesEndRef = useRef(null);

	// Scroll to the bottom whenever messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Toggle between dark and light theme modes
	const toggleTheme = () => {
		setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
	};


	const currentTheme = getTheme(mode);

	// Handle opening and closing of user menu
	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	// Handle user sign out logic
	const handleSignOut = () => {
		// Implement sign out logic here
		handleMenuClose();
	};

	return (
		<ThemeProvider theme={currentTheme}>
			{/* Main container for the page */}
			<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: currentTheme.palette.background.default }}>
				{/* App bar section */}
				<AppBar position="static" elevation={0} sx={{ backgroundColor: currentTheme.palette.background.paper }}>
					<Toolbar sx={{ justifyContent: 'space-between' }}>
						<Box display="flex" alignItems="center">
							{/* Chat icon and title */}
							<ChatIcon sx={{ mr: 1, color: currentTheme.palette.text.primary }} />
							<Typography variant="h6" color={currentTheme.palette.text.primary}>Headstarter Chat</Typography>
						</Box>
						<Box display="flex" alignItems="center">
							{/* Theme toggle button */}
							<IconButton color="inherit" onClick={toggleTheme} sx={{ color: currentTheme.palette.text.primary }}>
								{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
							</IconButton>
							{/* User menu button */}
							<IconButton color="inherit" onClick={handleMenuOpen} sx={{ color: currentTheme.palette.text.primary }}>
								<AccountCircleIcon />
							</IconButton>
							<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
								<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</AppBar>

				{/* Main chat container */}
				<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Box
						sx={{
							width: '90%',
							maxWidth: '800px',
							height: '80vh',
							border: `1px solid ${currentTheme.palette.divider}`,
							borderRadius: '20px',
							backgroundColor: currentTheme.palette.background.paper,
							display: 'flex',
							flexDirection: 'column',
							padding: 2,
							margin: '0 auto',
							boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
							position: 'relative',
						}}
					>
						{/* Message list */}
						<Stack
							direction="column"
							spacing={2}
							sx={{
								flexGrow: 1,
								overflowY: 'auto',
								paddingRight: 2,
								'&::-webkit-scrollbar': {
									width: '8px',
									backgroundColor: 'transparent',
								},
								'&::-webkit-scrollbar-track': {
									background: 'transparent',
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'rgba(255, 255, 255, 0.1)',
									borderRadius: '10px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'rgba(255, 255, 255, 0.2)',
								},
							}}
						>
							{messages.map((message, index) => (
								<Box
									key={index}
									sx={{
										maxWidth: '80%',
										borderRadius: '20px',
										padding: 2, // Increased padding
										marginBottom: 1, // Increased margin-bottom
										color: currentTheme.palette.text.primary,
										backgroundColor: message.role === 'assistant' ? currentTheme.palette.background.default : currentTheme.palette.primary.main,
										alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
										border: message.role === 'assistant' ? '1px solid #333' : `1px solid ${currentTheme.palette.primary.main}`,
										overflowWrap: 'break-word',
										lineHeight: '1.5', // Increased line-height for better readability
										// Markdown specific styles
										'& p': {
											marginBottom: '0px', // Space between paragraphs
										},
										'& ul, & ol': {
											marginLeft: '2em', // Space before list items
										},
										'& code': {
											backgroundColor: 'rgba(100,100,100,0.1)', // Change this to update background color of code blocks
											padding: '0.2em 0.4em',
											borderRadius: '4px',
											fontSize: '0.9em',
											// border: `1px solid ${currentTheme.palette.divider}`,
										},
										'& pre': {
											padding: '1em',
											borderRadius: '4px',
											overflowX: 'auto',
											whiteSpace: 'pre-wrap',
											marginBottom: '0.5em',
											// border: `1px solid ${currentTheme.palette.divider}`,
										},
									}}
								>
									<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
										{message.content}
									</ReactMarkdown>
								</Box>
							))}
							<div ref={messagesEndRef} />
						</Stack>

						{/* Message input and send button */}
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								paddingTop: 1,
								borderTop: `1px solid ${currentTheme.palette.divider}`,
							}}
						>
							<TextField
								variant="outlined"
								label="Type a message"
								fullWidth
								multiline // Allows for multiline input
								// rows={1} // Initial height (number of visible lines)
								maxRows={3} // Maximum height (number of visible lines when expanded)
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={handleKeyPress}
							/>
							<Button
								variant="contained"
								color="primary"
								onClick={sendMessage}
								sx={{
									marginLeft: 1,
									textTransform: 'none'
								}}
							>
								Send
							</Button>
						</Box>
					</Box>
				</Box>
			</Box >
		</ThemeProvider >
	);
}
