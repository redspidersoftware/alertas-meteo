"use client";

interface FooterProps {
  version?: string;
}

export default function Footer({ version }: FooterProps) {
  return (
    <footer className="bg-gray-200 text-center p-2 text-sm border-t mt-auto">
      {version ? `Versión: ${version}` : "Versión: Desconocida"}
    </footer>
  );
}
