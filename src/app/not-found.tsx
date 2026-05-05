import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
        <p className="mb-4">La page que vous recherchez n&apos;existe pas.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
