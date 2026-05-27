import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { EntryPage } from "./pages/EntryPage";
import { CallPage } from "./pages/CallPage";
import { TicketPage } from "./pages/TicketPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/ticket" element={<TicketPage />} />
      </Routes>
    </Router>
  );
}
