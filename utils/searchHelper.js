// utils/searchHelper.js
const natural = require("natural");

// Tokenizer = breaks text into words
const tokenizer = new natural.WordTokenizer();

function preprocess(text) {
  return tokenizer.tokenize(text.toLowerCase());
}

// Simple keyword-based smart search
function smartSearch(listings, query) {
  const queryTokens = preprocess(query);

  return listings.filter((listing) => {
    const text =
      `${listing.title} ${listing.description} ${listing.location}`.toLowerCase();
    const listingTokens = preprocess(text);

    // if any query word exists in the listing text
    return queryTokens.some((token) => listingTokens.includes(token));
  });
}

module.exports = { smartSearch };
