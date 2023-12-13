let blogConfig = {
  UNSPLASH_API: '',
  GOOGLE_API: '',
};

if (process.env.UNSPLASH_API) {
  blogConfig.UNSPLASH_API = process.env.UNSPLASH_API;
  console.log("No Unsplash API found");
};

if (process.env.GOOGLE_API) {
  blogConfig.GOOGLE_API = process.env.GOOGLE_API;
} else {
  console.log("No Google API found");
}

module.exports = blogConfig;
