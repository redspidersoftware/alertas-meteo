// src/components/Footer.tsx
"use client";

export default function Footer() {
  const version = process.env.NEXT_PUBLIC_VERSION || "desconocida";

  return (
    <footer className="w-full bg-gray-200 text-center p-2 text-sm border-t mt-auto">
      Versión: {version}
    </footer>
  );
}
