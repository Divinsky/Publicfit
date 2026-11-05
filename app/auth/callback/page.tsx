import Link from "next/link";

export const metadata = {
  title: "Authorization — PublicFit",
  description: "PublicFit's OAuth callback for Meta authorization.",
};

export default function AuthCallback({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const code = typeof searchParams?.code === "string" ? searchParams.code : null;
  const error =
    typeof searchParams?.error === "string" ? searchParams.error : null;
  const errorDescription =
    typeof searchParams?.error_description === "string"
      ? searchParams.error_description
      : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-bold">
          {error ? "Authorization didn't complete" : "Authorization complete"}
        </h1>
      </div>

      <section className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 text-stone-700">
        {error ? (
          <>
            <p>
              The authorization was not completed. Meta returned the error{" "}
              <code className="bg-stone-100 rounded px-1.5 py-0.5 text-sm">{error}</code>
              {errorDescription ? (
                <>
                  {" — "}
                  {errorDescription}
                </>
              ) : (
                "."
              )}
            </p>
            <p>
              If this was a mistake, try the connection again from the Meta
              developer dashboard, or head back to the Predictor.
            </p>
          </>
        ) : code ? (
          <>
            <p>
              Your authorization code was received. Codes are single-use and
              expire quickly — complete the token exchange in the Meta
              developer dashboard or your app to finish connecting.
            </p>
            <p>
              This page does not store the code or any account details.
            </p>
          </>
        ) : (
          <>
            <p>
              This is PublicFit&apos;s OAuth callback. It receives the result
              of a Meta authorization and confirms it here.
            </p>
            <p>
              If you arrived here directly, there is nothing to complete.
            </p>
          </>
        )}
      </section>

      <Link
        href="/"
        className="inline-block bg-ink text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90"
      >
        Back to the Predictor
      </Link>
    </div>
  );
}
