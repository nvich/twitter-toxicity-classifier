import axios from "axios";

export const getUserTweets = user => {
  return axios.get(`/api/tweets/${user}`);
};