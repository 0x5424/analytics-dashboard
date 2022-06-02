import * as functions from 'firebase-functions'
import {Request, Response} from 'express'
import {getDatabase} from 'firebase-admin/database'
import type {TTweetv2TweetField, TTweetv2MediaField, TTweetv2Expansion} from 'twitter-api-v2'
import {TwitterApi} from 'twitter-api-v2'

import {handleError} from '../utils/errors'

const TWEET_FIELDS: TTweetv2TweetField[] = [
  'public_metrics',
  'non_public_metrics',
  'organic_metrics',
  'promoted_metrics',
]

const MEDIA_FIELDS: TTweetv2MediaField[] = [
  'public_metrics',
  'non_public_metrics',
  'organic_metrics',
]

const MEDIA_EXPANSIONS: TTweetv2Expansion[] = ['attachments.media_keys']

interface TwitterCredentials {
  access_token: string;
  refresh_token: string;
}

export const analyzeTweet = async (req: Request, res: Response) => {
  try {
    const {twitterId, tweetUrl} = req.body?.data || {}
    if (!twitterId || !tweetUrl) return res.status(400).send({message: 'Missing fields'})
    /**
     * Format:
     * ```
     * ['', 'simpleflips', 'status', '1336022100654485504']
     * ```
     */
    // const [_, _user, _status, tweetId] = new URL(tweetUrl).pathname
    const [, , , tweetId] = new URL(tweetUrl).pathname.split('/')

    let twitter: TwitterCredentials | undefined

    await getDatabase().ref(`/twitters/${twitterId}`).once('value', (snapshot) => {
      twitter = snapshot.val() as TwitterCredentials | undefined
    })

    if (!twitter) return res.status(404).send({message: 'Not found'})

    /**
     * @todo Beautiful handling for refresh_token
     * @see {@link https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/auth.md#optional-refresh-the-token-later}
     */
    const client = new TwitterApi(twitter.access_token)

    const tweet = await client.v2.singleTweet(tweetId, {
      'tweet.fields': TWEET_FIELDS,
      'expansions': MEDIA_EXPANSIONS,
      'media.fields': MEDIA_FIELDS,
    })

    functions.logger.log('[analyzeTweet] Response:', tweet)

    return res.status(200).send({data: tweet})
  } catch (err) {
    return handleError(res, err)
  }
}
