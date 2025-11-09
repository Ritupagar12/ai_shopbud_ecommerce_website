// Purpose: Generate AI-powered product recommendations using Google's Gemini API

export async function getAIRecommendation(req, res, userPrompt, products) {
    // --- STEP 1: Setup API credentials and endpoint ---
    // Fetch the Gemini API key from environment variables for security.
    const API_KEY = process.env.GEMINI_API_KEY;

    // The specific Gemini endpoint for generating text-based responses.
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    try {
        // --- STEP 2: Create the AI prompt ---
        // The prompt is what you send to Gemini — it contains both:
        // (a) A list of available products from your database
        // (b) The user’s query or intent (what they're looking for)
        //
        // The model is instructed to respond only with JSON of matching products.

        const geminiPrompt = `
        Here is a list of available products:
        ${JSON.stringify(products, null, 2)}

        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Only return the matching products in JSON format.
        `;

        // --- STEP 3: Send the prompt to Gemini API ---
        // Using `fetch` to make an HTTP POST request to the Gemini API.
        // The `contents` structure matches Google's generative language format.
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: geminiPrompt }] }],
            }),
        });

        // --- STEP 4: Convert the API response to JSON ---
        // Gemini’s response is deeply nested; we’ll safely access the useful text.
        const data = await response.json();

        // --- STEP 5: Extract AI-generated text safely ---
        // Gemini models typically return results under:
        // data.candidates[0].content.parts[0].text
        // The optional chaining ensures your code doesn’t break if any field is missing.
        const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        // --- STEP 6: Clean Gemini’s response ---
        // Gemini might wrap its output in Markdown-style ```json ... ``` blocks.
        // We remove those markers to safely parse the text as JSON.
        const cleanedText = aiResponseText.replace(/```json|```/g, ``).trim()

        // --- STEP 7: Handle empty or invalid responses ---
        // If Gemini didn’t return any valid text, return an error to the frontend.
        if (!cleanedText) {
            return res.status(500).json({
                success: false,
                message: "AI response is empty or invalid."
            });
        }

        // --- STEP 8: Try parsing the cleaned AI output ---
        // Since Gemini returns plain text, we must parse it into a JS object.
        // If parsing fails, it means the AI didn’t return valid JSON.
        let parseProducts;
        try {
            parseProducts = JSON.parse(cleanedText);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to parse AI response."
            });
        }
        // --- STEP 9: Successfully return AI-filtered products ---
        // The function returns an object instead of sending a direct response,
        // allowing flexibility for the caller to handle the result.
        return { success: true, products: parseProducts };
    } catch (error) {
        // --- STEP 10: Catch any unexpected errors (network, API, etc.) ---
        // This handles cases where Gemini is unreachable or returns an invalid structure.
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }

}