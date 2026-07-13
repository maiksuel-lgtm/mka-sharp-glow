import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>Página não encontrada — MkA Cortes</title>
        <meta name="description" content="A página que você procura não existe. Volte à página inicial da MkA Cortes para agendar seu corte." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://mka-cortes.lovable.app/404" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404 — Página não encontrada</h1>
        <p className="mb-4 text-xl text-muted-foreground">A página que você procura não existe.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar para o início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
