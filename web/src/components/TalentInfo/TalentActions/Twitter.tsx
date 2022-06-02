import type {Component} from 'solid-js'
import {Show, createSignal, createEffect} from 'solid-js'

import {analyzeTweet} from '../../../utils/functions'

import styles from './TalentActions.module.css'

const UrlDescription: Component = ({ url }) => {
  return (
    <p class={styles.alignCenter}>
      Press the button again to copy, or copy this URL directly and send to the talent:
      <br />
      <code class={styles.talentUrl}>{url()}</code>
    </p>
  )
}

const InitialDescription: Component = ({ selectedTalent }) => {
  return(
    <p>
      Generate a unique URL to link <code class={styles.talentName}>{selectedTalent().name}</code>'s Twitter account.
    </p>
  )
}

const AnalyzeButton: Component = ({ selectedTwitter, setClicked }) => {
  return (
    <>
    <button class={styles.action} onclick={() => setClicked(true)}>Analyze</button>
      Get tweet metrics for
      <a
        href={`https://twitter.com/${selectedTwitter().screen_name}`}
        ref="noreferrer"
        target="_blank"
        class={styles.link}
      >
        <code class={styles.talentName}>
          {`@${selectedTwitter().screen_name}`}
        </code>
    </a>
    's tweets.
  </>)
}

const AnalyzeSection: Component = ({ selectedTalent, selectedTwitter }) => {
  let textRef, checkboxRef
  const [clicked, setClicked] = createSignal(false)
  const [parsedTweet, setParsedTweet] = createSignal(null)

  createEffect(() => {
    // Subscribe to selectedTwitter to ensure we clear the recently parsed tweet
    selectedTwitter()
    setParsedTweet(null)
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      twitterId: selectedTalent().twitter_user_id,
      tweetUrl: textRef.value,
      promoted: checkboxRef.checked
    }

    setParsedTweet(textRef.value)
    const result = await analyzeTweet(payload)

    /**
     * @todo Parse response payload & render results
     */
    console.log('[analyzeTweet] Function response:', result)
  }

  return(
    <Show when={clicked()} fallback={<AnalyzeButton selectedTwitter={selectedTwitter} setClicked={setClicked}/>}>
      <section class={styles.tweetSection}>
        <div class={styles.warningContainer}>
          <strong class={styles.warningLabel}>Notes (June 2022)</strong>
          <p>
            The Twitter API currently does not retrieve metrics for tweets older than 30 days.<br />
            As such, the tweet author will need to provide info about such tweets manually. <br />
            Additionally, <strong>private accounts return no link metrics</strong>!
          </p>
          <strong class={styles.warningLabel}>Usage</strong>
          <p>
            Paste the URL of a tweet from <strong style="font-family: monospace">@{selectedTwitter().screen_name}</strong> in the field below and press enter.<br />
            The impressions, link clicks, engagements {'&'} raw payload will be returned.
          </p>
        </div>
        <form onsubmit={handleSubmit}>
          <input type="text" ref={textRef} />
          <label for="promoted">
            <span>
              Promoted?
              <input name="promoted" type="checkbox" ref={checkboxRef} />
            </span>
          </label>
        </form>
      </section>
    </Show>
  )
}

export const Twitter: Component = ({selectedTalent, selectedTwitter}) => {
  const [clicked, setClicked] = createSignal(false)

  createEffect(() => {
    // Subscribe to selectedUser to reset `setClicked`
    selectedTalent()
    setClicked(false)
  })

  // Derived signals
  const isLinked = () => !!selectedTwitter()
  const url = () => `${API_URL_BASE}/v1/talents/${selectedTalent().id}/actions/redirect_twitter`
  const actionText = () => clicked() ? 'Copy URL' : 'Link Twitter'

  /**
   * @todo Study lifecycle & understand why Show.children works, but normal ternary (`selectedTwitter() ? Linked : Button`) fails
   */
  return (
    <>
      <Show when={!selectedTwitter()}>
        <button class={styles.action} onclick={() => clicked() ? navigator.clipboard.writeText(url()) : setClicked(true)}>
          {actionText()}
        </button>
        {clicked() ? <UrlDescription url={url} /> : <InitialDescription selectedTalent={selectedTalent} />}
      </Show>
      <Show when={selectedTwitter()}>
        <AnalyzeSection selectedTalent={selectedTalent} selectedTwitter={selectedTwitter} />
      </Show>
    </>
  )
}
