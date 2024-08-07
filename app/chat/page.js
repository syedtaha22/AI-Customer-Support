'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Container,
	Box,
	IconButton,
	TextField,
	Stack,
	Grow,
} from '@mui/material';
import { Search as SearchIcon, Assistant } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // GitHub dark theme for code highlighting

// Functional component to render a custom Bot Icon using SVG
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

// Main Page component
const Page = () => {
	// State to store chat messages
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: "Hi! I'm the AI Assistant. How can I help you today?",
		},
	]);
	// State to store the current message input by the user
	const [message, setMessage] = useState('');
	// State to indicate whether a message is being processed
	const [isLoading, setIsLoading] = useState(false);
	// State to track if the input should be at the bottom of the screen
	const [inputAtBottom, setInputAtBottom] = useState(false);
	// Ref to keep track of the messages end for auto-scrolling
	const messagesEndRef = useRef(null);
	// Ref to keep track of the input field
	const inputRef = useRef(null);

	// Function to send a message
	const sendMessage = async () => {
		// Prevent sending empty messages or if already loading
		if (!message.trim() || isLoading) return;
		setIsLoading(true); // Set loading state

		// Add user message and a placeholder for assistant response
		setMessages((prevMessages) => [
			...prevMessages,
			{ role: 'user', content: message },
			{ role: 'assistant', content: '' },
		]);

		setMessage(''); // Clear the message input

		try {
			// Send user message to the server
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify([...messages, { role: 'user', content: message }]),
			});

			// Throw error if network response is not ok
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// Read and decode the stream of data from the server
			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const text = decoder.decode(value, { stream: true });
				setMessages((prevMessages) => {
					let lastMessage = prevMessages[prevMessages.length - 1];
					let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
					return [
						...otherMessages,
						{ ...lastMessage, content: lastMessage.content + text },
					];
				});
			}
		} catch (error) {
			console.error('Error:', error);
			// Display error message if an error occurs
			setMessages((prevMessages) => [
				...prevMessages,
				{
					role: 'assistant',
					content: "I'm sorry, but I encountered an error. Please try again later.",
				},
			]);
		}

		setIsLoading(false); // Reset loading state
	};

	// Handle Enter key press to send a message
	const handleKeyPress = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			setInputAtBottom(true); // Move the input field to the bottom
			sendMessage(); // Send the message
		}
	};

	// Scroll to the bottom of the messages container
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Scroll to the bottom whenever messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		// Main container with dark background
		<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: 'white' }}>
			{/* App bar with bot icon and sign out button */}
			<AppBar position="static" elevation={0} style={{ backgroundColor: '#121212', color: 'white' }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="bot-icon">
						<BotIcon />
					</IconButton>
					<Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
						AI Assistant
					</Typography>
					<Button
						color="inherit"
						variant="outlined"
						style={{
							marginLeft: 10,
							borderColor: 'white',
							borderRadius: '50px',
							textTransform: 'none',
							position: 'relative',
							backgroundColor: 'transparent',
							color: 'white',
							border: '2px solid white',
							overflow: 'hidden',
							transition: 'all 0.3s ease',
						}}
						// Change button color on hover
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = 'white';
							e.currentTarget.style.color = 'black';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent';
							e.currentTarget.style.color = 'white';
						}}
					>
						Sign Out
					</Button>
				</Toolbar>
			</AppBar>

			{/* Main content area */}
			<main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '55px' }}>
				{!inputAtBottom ? (
					// Initial state: Landing page with welcome message and input box
					<Container maxWidth="md" style={{ textAlign: 'center' }}>
						<Typography variant="h3" component="h1" gutterBottom align="center" style={{ color: 'white' }} mt="15vh">
							Effortless Customer Service with AI
						</Typography>
						<Typography variant="h5" paragraph align="center" style={{ color: '#b0b0b0' }}>
							Our AI-powered assistant is here to help you with all your customer service needs. Get instant answers and personalized support.
						</Typography>
						<Box mt={4} display="flex" justifyContent="center">
							<TextField
								variant="outlined"
								autoComplete="off"
								placeholder="Ask me anything..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								InputProps={{
									startAdornment: (
										<IconButton position="start">
											<SearchIcon style={{ color: 'white' }} />
										</IconButton>
									),
								}}
								fullWidth
								sx={{
									backgroundColor: '#333',
									color: 'white',
									borderRadius: '50px',
									width: '600px', // Set a fixed width
									'& .MuiOutlinedInput-root': {
										borderRadius: '50px',
										'& fieldset': {
											borderColor: '#555',
										},
										'&:hover fieldset': {
											borderColor: '#777',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'white',
										},
									},
									'& .MuiInputBase-input': {
										color: 'white',
									},
									'& .MuiInputLabel-root': {
										color: '#aaa',
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: 'white',
									},
								}}
								ref={inputRef}
							/>
						</Box>
					</Container>
				) : (
					// Chat state: Messages list and input at bottom
					<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								flexGrow: 1,
								maxWidth: 'md',
								margin: '0 auto',
								padding: 2,
								overflowY: 'auto',
								height: 'calc(100vh - 120px)', // Adjust height to fit messages container
								'&::-webkit-scrollbar': {
									width: '8px',
									background: 'transparent',
								},
								'&::-webkit-scrollbar-track': {
									background: 'transparent',
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'transparent',
									borderRadius: '10px',
									transition: 'background 5s ease', /* Add transition effect */
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'rgba(255, 255, 255, 0.2)',
								},
							}}
						>
							<Stack direction="column" spacing={2}>
								{messages.map((msg, index) => (
									<Box
										key={index}
										sx={{
											maxWidth: '80%',
											borderRadius: '20px',
											padding: 2,
											marginBottom: 1,
											color: 'white',
											backgroundColor: msg.role === 'assistant' ? '#333' : '#1e1e1e',
											alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
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
												// border: 1px solid ${currentTheme.palette.divider},
											},
											'& pre': {
												padding: '1em',
												borderRadius: '4px',
												overflowX: 'auto',
												whiteSpace: 'pre-wrap',
												marginBottom: '0.5em',
												// border: 1px solid ${currentTheme.palette.divider},
											}
										}}
									>
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											rehypePlugins={[rehypeHighlight]}
											components={{
												a: ({ node, ...props }) => (
													<a {...props} target="_blank" rel="noopener noreferrer" />
												),
											}}
										>
											{msg.content}
										</ReactMarkdown>
									</Box>
								))}
								{/* Reference to scroll to the bottom */}
								<div ref={messagesEndRef} />
							</Stack>
						</Box>

						{/* Input box at the bottom */}
						<Grow in={inputAtBottom} timeout={500}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									position: 'fixed',
									bottom: 0,
									left: 0,
									right: 0,
									padding: 2,
									width: '100%', // Ensure the box stretches across the full width
									transition: 'transform 0.5s ease-in-out', // Use transform for smoother transition
									transform: inputAtBottom ? 'translateY(0)' : 'translateY(100%)', // Apply the transform for smooth movement
									zIndex: 1,
									backgroundColor: '#121212',
								}}
							>
								<TextField
									variant="outlined"
									placeholder="Ask me anything..."
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									InputProps={{
										endAdornment: (
											<IconButton onClick={sendMessage} disabled={isLoading}>
												<SearchIcon style={{ color: 'white' }} />
											</IconButton>
										),
									}}
									fullWidth
									sx={{
										backgroundColor: '#333',
										color: 'white',
										borderRadius: '50px',
										width: '600px', // Set a fixed width
										'& .MuiOutlinedInput-root': {
											borderRadius: '50px',
											'& fieldset': {
												borderColor: '#555',
											},
											'&:hover fieldset': {
												borderColor: '#777',
											},
											'&.Mui-focused fieldset': {
												borderColor: 'white',
											},
										},
										'& .MuiInputBase-input': {
											color: 'white',
										},
										'& .MuiInputLabel-root': {
											color: '#aaa',
										},
										'& .MuiInputLabel-root.Mui-focused': {
											color: 'white',
										},
									}}
									ref={inputRef}
								/>
							</Box>
						</Grow>
					</Box>
				)}
			</main>
		</div>
	);
};

export default Page;
