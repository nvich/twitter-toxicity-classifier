import React from "react";
import { getUserTweets } from "../../util/tweet";

class Tweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweetText: {},
      searchOption: "Tweet",
      searchInput: "",
      errors: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }

  componentDidMount() {}

  update(field) {
    return (e) => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    // clear results
    this.setState({ errors: {} });
    this.setState({ tweets: [] });
    this.setState({ tweetText: [] });

    e.preventDefault();
    getUserTweets(this.state.searchInput)
      .then((tweet) => {
        let tweetObj = Object.assign({}, this.state.tweetText, tweet.data);
        this.setState({ tweetText: tweetObj }, () =>
          console.log(this.state.tweetText)
        );
      })
      .catch((err) => {
        if (!!err.response) this.setState({ errors: err.response.data });
      });
  }

  handleErrors() {
    let errorsArr = Object.values(this.state.errors);
    if (errorsArr.length > 0) {
      return errorsArr.map((error, i) => <div key={`error-${i}`}>{error}</div>);
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="userInput">{this.state.searchOption}</label>
          <input
            id="userInput"
            type="text"
            placeholder="Enter a twitter @user"
            value={this.state.searchInput}
            onChange={this.update("searchInput")}
          />
          <input type="submit" value="search" />
        </form>
        {this.handleErrors()}
        {/* {this.state.tweetText.map((ele, i) => (
          <div key={`tweet-${i}`}>{ele}</div>
        ))} */}
      </div>
    );
  }
}

export default Tweet;
