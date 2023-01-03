export const SITE = {
  name: "Joshua Booth",
  domain: "https://joshua-booth-astro.netlify.app/",
  basePathname: "/",
  github: "https://github.com/Joshua-Booth/astro-site",

  formspreeId: "xyyknvro",
};

export const CONTACT = {
  phone: { raw: "+64-027-943-4727", formatted: "+64 027 943 4727" },
  email: "me@joshuabooth.nz",
  linkedIn: "https://www.linkedin.com/in/joshua-booth/",
  instagram: "https://www.instagram.com/joshuabooth.nz",
  github: "https://github.com/Joshua-Booth",
  twitter: "https://twitter.com/JoshuaBoothNZ",
};

export const BLOG = {
  disabled: false,
  postsPerPage: 6,

  blog: {
    disabled: false,
    pathname: "blog", // blog main path, you can change this to "articles" (/articles)
  },

  post: {
    disabled: false,
    pathname: "", // empty for /some-post, value for /pathname/some-post
  },

  category: {
    disabled: false,
    pathname: "category", // set empty to change from /category/some-category to /some-category
  },

  tag: {
    disabled: false,
    pathname: "tag", // set empty to change from /tag/some-tag to /some-tag
  },
};
