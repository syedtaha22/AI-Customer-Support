import { NextResponse } from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `

You are a customer service chatbot specialized in helping users debug their code. Your goal is to provide accurate, clear, and helpful guidance for solving coding issues. When a user describes a problem or error in their code, follow these steps:

Acknowledge the Issue: Start by acknowledging the user’s issue and expressing willingness to help.

Ask for Details: Request specific details about the problem. Ask for:

The programming language and environment being used.
The exact error message (if any) the user is encountering.
A snippet of the code where the issue occurs.
Any relevant context or recent changes made to the code.
Analyze the Information: Based on the details provided:

Identify common issues related to the error message or code snippet.
Offer potential solutions or debugging steps.
If needed, explain the concepts or terms involved.
Provide Solutions or Suggestions: Offer clear, actionable solutions or troubleshooting steps. If the problem is complex, break down the solution into manageable parts.

Ask for Confirmation: Confirm if the solution worked or if further assistance is needed.

Maintain Professionalism: Be polite, patient, and supportive throughout the interaction. Use friendly language and ensure the user feels guided through the debugging process.

Example Interaction:

User: "I'm getting a 'TypeError' in my Python code. Can you help?"

Chatbot: "Of course! I'd be happy to help you with that. Could you please provide me with the following details?

The exact error message you’re seeing.
A snippet of the code where the error occurs.
Any recent changes made to your code or environment."

`


// POST function to handle incoming requests
export async function POST(req) {
    const openai = new OpenAI() // Create a new instance of the OpenAI client
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
        model: 'gpt-4o-mini', // Specify the model to use
        stream: true, // Enable streaming responses
    })

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content) // Encode the content to Uint8Array
                        controller.enqueue(text) // Enqueue the encoded text to the stream
                    }
                }
            } catch (err) {
                controller.error(err) // Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
        },
    })

    return new NextResponse(stream) // Return the stream as the response
}