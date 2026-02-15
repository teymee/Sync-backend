export const APIs = {
  // 🚨 User
  topUserItems: {
    base: "/me/top/items",
    api: (items) => `/me/top/${items?.type}`,
  },

  // 🚨 artist albums
  artistAlbums: {
    base: "/artist-albums",
    api: (id) => `/artists/${id}/albums`,
  },

  // 🚨 artist details
  artistDetails: {
    base: "/artist-details",
    api: (id) => `/artists/${id}`,
  },

  // 🚨 Audio
  audioFeature: {
    base: "/audio-features",
    api: (trackId) => `/audio-features/${trackId}`,
  },
};
