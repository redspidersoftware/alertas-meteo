"use client";

export default function Footer() {
  // Usa variable de entorno NEXT_PUBLIC_VERSION
  const version = process.env.NEXT_PUBLIC_VERSION || "desconocida";

  return (
    <footer className="bg-gray-200 text-center p-2 text-sm border-t mt-auto">
      Versión: {version}
    </footer>
  );
}
