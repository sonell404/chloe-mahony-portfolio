// src/js/StoryblokService.js
const StoryblokService = {
  accessToken: "jUH95uLxSKd141Q7IiTZFAtt",
  async getData(slug) {
    try {
      const response = await fetch(
        `https://api.storyblok.com/v1/cdn/stories/${slug}?token=${this.accessToken}`
      );
      const data = await response.json();
      return data.story;
    } catch (error) {
      console.error("Error fetching data from Storyblok:", error);
      return null;
    }
  },
};

export default StoryblokService;
