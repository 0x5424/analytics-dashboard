import {firebaseApp} from './firebase-app'
import {getFunctions, httpsCallableFromURL} from 'firebase/functions'

const ANALYZE_TWEET_PATH = `${API_URL_BASE}/v1/actions/analyze_tweet`

const allFunctions = getFunctions(firebaseApp)

export const analyzeTweet = ({twitterId, tweetUrl, promoted}) => {
  const invoke = httpsCallableFromURL(allFunctions, ANALYZE_TWEET_PATH)

  return invoke({twitterId, tweetUrl, promoted})
}
