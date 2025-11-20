import { BackgroundEffects } from "@/components/BackgroundEffects";
import { BookingLookup } from "@/components/BookingLookup";
import { NavLink } from "@/components/NavLink";
import { ArrowLeft } from "lucide-react";

export default function BookingStatus() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Home
          </NavLink>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Consultar Agendamento
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use o código de confirmação que você recebeu ao fazer o agendamento para consultar seu status
          </p>
        </div>

        <BookingLookup />
      </div>
    </div>
  );
}
