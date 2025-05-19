import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">Gerenciador de Eventos</h1>
          <p>Faça login com sua conta Google para continuar.</p>
          <a href="/auth/google">
            <Button className="w-full">Login com Google</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function Profile() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch("/profile", { credentials: "include" })
      .then(res => {
        if (res.status === 401) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(false));
  }, []);

  if (user === null) return <div className="text-center p-4">Carregando...</div>;
  if (user === false) return <Navigate to="/" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Bem-vindo, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <a href="/logout">
            <Button className="w-full" variant="destructive">Sair</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}