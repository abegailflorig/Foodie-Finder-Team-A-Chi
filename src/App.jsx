import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoadingPage from "./pages/LoadingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import FeedbackPage from "./pages/FeedbackPage";
import ResFeedback from "./pages/ResFeedback.jsx";
import CategoriesPage from "./pages/CategoriesPage";
import LocationPage from "./pages/LocationPage";
import Cupsilog from "./restaurant/Cupsilog"
import FavoritePage from "./pages/FavoritePage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/detailspage" element={<DetailsPage />} />
        <Route path="/feedbackpage" element={<FeedbackPage />} />
        <Route path="/resfeedback" element={<ResFeedback />} />
        <Route path="/categoriespage" element={<CategoriesPage />} />
        <Route path="/locationpage" element={<LocationPage />} />
        <Route path="/cupsilog" element={<Cupsilog />} />
        <Route path="/favoritepage" element={<FavoritePage />} />
        <Route path="/profilepage" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
