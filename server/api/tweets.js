const express = require("express");
const router = express.Router();
const Twitter = require("twitter");
require("@tensorflow/tfjs-node");
const toxicity = require("@tensorflow-models/toxicity");

router.get("/test", (req, res) => {
  res.json({ msg: "This is the tweet route" });
});

router.get("/:user", (req, res) => {
  var client = new Twitter({
    bearer_token: process.env.TWITTER_BEARER_TOKEN,
  });

  const params = {
    screen_name: `${req.params.user}`,
    include_rts: "false",
    count: "100",
    trim_user: "false",
    tweet_mode: "extended",
  };

  const path = "https://api.twitter.com/1.1/statuses/user_timeline.json";

  client
    .get(path, params)
    .then((tweet) => {
      let resultArr = Object.values(tweet).map((ele) => ele.full_text);
      return tweetyBoi(resultArr);
    })
    .then((tweets) => res.json(tweets))
    .catch((err) =>
      res
        .status(404)
        .json({ noUserFound: "User Not Found. Please try another." })
    );
});

function tweetyBoi(tweetsArr) {
  const threshold = 0.8;

  return toxicity.load(threshold).then((model) => {
    const sentences = tweetsArr;

    return model.classify(sentences).then((predictions) => {
      let resultsArr = predictions[predictions.length - 1].results;
      let resultsObj = {};
      let results2 = resultsArr.map((ele) => ele.match);
      sentences.forEach((tweet, index) => {
        resultsObj[tweet] = results2[index];
      });

      return resultsObj;
    });
  });
}

module.exports = router;
