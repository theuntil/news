"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <html>
      <body>
        <h2>Bir hata oluştu</h2>
        <button onClick={() => reset()}>Tekrar dene</button>
      </body>
    </html>
  );
}
