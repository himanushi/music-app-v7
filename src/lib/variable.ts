const getContent = (selector: string) => {
  if (typeof document !== "undefined") {
    return document.querySelector<HTMLMetaElement>(selector)?.content;
  }
};

const getTitle = () => {
  if (typeof document !== "undefined") {
    return document.querySelector<HTMLMetaElement>("title")?.innerText;
  }
};

export const title = getTitle();

export const originUrl = getContent("meta[property='ms:origin-url']");

export const graphqlUrl = getContent("meta[property='ms:graphql-url']");

export const recaptchaKey = getContent("meta[property='ms:recaptcha-key']");

export const googleAnalyticsId = getContent(
  "meta[property='ms:google-analytics-id']"
);

export const appleAffiliateToken = getContent(
  "meta[property='ms:apple-affiliate-token']"
);

export const twitterAccount =
  getContent("meta[property='ms:twitter-account']") || "vgm_net";
