import Header from "./Header";
import Footer from "./Footer";
import TextToSpeechCard from "./TextToSpeechCard";
import "./styles/dashboard.css";

const user = {
  name: "User", 
  avatar: "https://via.placeholder.com/40",
};

const apiUrl = "https://35smzwnuoc.execute-api.us-east-1.amazonaws.com/dev/convert";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Header
        name={user.name}
        avatar={user.avatar}
        onLogout={() => {
          console.log("User logged out.");
        }}
      />

      <main className="dashboard-main">
        <div className="card">
          <TextToSpeechCard apiUrl={apiUrl} />
          <Footer />
        </div>
      </main>
    </div>
  );
}
