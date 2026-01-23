import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Dashboard Progres Hanif Firdaus</h1>
        </div>
      </header>
      <DashboardPage />
    </div>
  );
}
