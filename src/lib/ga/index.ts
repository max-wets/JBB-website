interface gaWindow extends Window {
  gtag: (
    type: string,
    googleKey: string,
    options: Record<string, unknown>,
  ) => unknown;
}

// log the pageview with their URL
export const pageview = (url: string) => {
  (window as gaWindow & typeof globalThis).gtag(
    "config",
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!,
    {
      page_path: url,
    },
  );
};

// log specific events happening.
export const event = ({
  action,
  params,
}: {
  action: string;
  params: Record<string, unknown>;
}) => {
  (window as gaWindow & typeof globalThis).gtag("event", action, params);
};
