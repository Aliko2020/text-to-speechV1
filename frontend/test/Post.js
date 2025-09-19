import { convertTextToSpeech } from "../src/api/convertApi";
const apiUrl = "https://35smzwnuoc.execute-api.us-east-1.amazonaws.com/dev/convert";
const text = "Welcome to our text-to-speech service!";
const voice = "Amy";

convertTextToSpeech(text, apiUrl, voice)
  .then(data => {
    console.log("Generated Audio URL:", data.audio_url);
    
  })
  .catch(error => {
    console.error("Error during conversion:", error.message);
  });
