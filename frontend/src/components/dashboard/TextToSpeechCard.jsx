import { useState } from "react";
import { FaDownload } from 'react-icons/fa';
import Spinnah from "../Spinner";
import { toast } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import Toastify CSS

export default function TextToSpeechCard({ apiUrl }) {
    const [text, setText] = useState("");
    const [selectedVoice, setSelectedVoice] = useState("Amy");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [error, setError] = useState(null);

    const voices = [
        { name: "Amy", label: "Amy (British English)" },
        { name: "Brian", label: "Brian (British English)" },
        { name: "Joanna", label: "Joanna (US English)" },
        { name: "Matthew", label: "Matthew (US English)" },
        { name: "Aditi", label: "Aditi (Indian English)" },
        { name: "Raveena", label: "Raveena (Indian English)" },
        { name: "Mizuki", label: "Mizuki (Japanese)" },
        { name: "Hans", label: "Hans (German)" },
    ];

    const handleTextChange = (e) => setText(e.target.value);
    const handleVoiceChange = (e) => setSelectedVoice(e.target.value);

    async function convertTextToSpeech(text, apiUrl, voice) {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                voiceId: voice
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to convert text to speech");
        }

        return await response.json();
    }

    const handleConvert = async () => {
        if (!text.trim()) {
            toast.error("Please enter some text.");  // Display error toast
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setAudioUrl("");

        try {
            const result = await convertTextToSpeech(text, apiUrl, selectedVoice);
            setAudioUrl(result.audio_url);
            toast.success("Conversion successful!");  // Display success toast
        } catch (err) {
            setError(err.message || "Conversion failed");
            toast.error(err.message || "Conversion failed");  // Display error toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card-details">
            <h3 className="card-title">Text to Speech Converter</h3>

            <textarea
                className="text-area"
                rows={4}
                placeholder="Enter your text here..."
                value={text}
                onChange={handleTextChange}
            />

            <select
                className="dropdown"
                value={selectedVoice}
                onChange={handleVoiceChange}
            >
                {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                        {voice.label}
                    </option>
                ))}
            </select>

            <button
                className="convert-button"
                onClick={handleConvert}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Converting..." : "Convert to Speech"}
            </button>

            {audioUrl && (
                <>
                    <audio controls className="audio-player">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <a
                        href={audioUrl}
                        download="converted-audio.mp3"
                        className="download-button"
                    >
                        <FaDownload style={{ marginRight: '8px' }} />
                        Download Audio
                    </a>
                </>
            )}
        </div>
    );
}
