import { prevUser } from "./context/UserContext"
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
 export async function generateResponse() {

  let RequestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY
    },

    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prevUser.prompt
            },

            ...(prevUser.data ? [{
              inline_data: {
                mime_type: prevUser.mime_type,
                data: prevUser.data
              }
            }] : [])
          ]
        }
      ]
    })
  };

 try {
  let response = await fetch(API_URL, RequestOption);

  console.log("Status:", response.status);

  let data = await response.json();
  if (!response.ok) {
  return `Error: ${response.status}`;
}

  console.log("Data:", data);

  let apiResponse =
    data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.trim();

  return apiResponse;
}
catch (error) {
  console.log("API Error:", error);
  return "Error occurred";
}
 }