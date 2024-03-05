const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  try {
    // https://developer.github.com/v3/repos/#get
    let json = await EleventyFetch("https://api.github.com/repos/Riggd/portfolio/branches/main", {
      duration: "1d", // 1 day
      type: "json" // also supports "text" or "buffer"
    });

    return {
      lastCommit: json.commit.commit.committer.date
    };
  } catch(e) {
    console.log( "Failed getting GitHub commit date count, returning 0" );
    return {
      lastCommit: "None"
    };
  }
};