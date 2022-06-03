import type {Component} from 'solid-js'
import {children, Show, createSignal, createEffect} from 'solid-js'

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
      Generate a unique URL to link <code class={styles.pinkText}>{selectedTalent().name}</code>'s Twitter account.
    </p>
  )
}

const Link: Component = ({ href, text, pad, children: childComponents }) => {
  const c = children(() => childComponents)
  return (
    <a
      href={href}
      ref="noreferrer"
      target="_blank"
      class={styles.link}
      class={!!pad ? styles.pad5 : null}
      class={styles.pinkText}
    >
      {text ? text : c()}
  </a>)
}

const AnalyzeButton: Component = ({ selectedTwitter, setClicked }) => {
  return (
    <>
    <button class={styles.action} onclick={() => setClicked(true)}>Analyze</button>
      Get tweet metrics for
      <Link
        pad
        href={`https://twitter.com/${selectedTwitter().screen_name}`}
      >
        <code>
          {`@${selectedTwitter().screen_name}`}
        </code>
    </Link>
    's tweets.
  </>)
}

const TweetResult: Component = ({ tweet }) => {
  const [collapsed, setCollapsed] = createSignal(true)
  const toggleCollapse = () => setCollapsed(!collapsed())

  const hasErrors = () => tweet().data.errors

  return(
    <>
      <Show when={!hasErrors()} fallback={<pre>TWITTER API ERROR: See raw payload for error messages.</pre>}>
        <div class={styles.analyticsGrid}>
          <div>
            <h4>Impressions</h4>
            <pre>{tweet().data.non_public_metrics.impression_count}</pre>
          </div>
          <div>
            <h4>Link clicks</h4>
            <pre>{tweet().data.non_public_metrics.url_link_clicks || 'N/A'}</pre>
          </div>
        </div>
      </Show>
      <pre
        class={styles.collapsible}
        class={collapsed() ? styles.underline : null}
        onclick={toggleCollapse}
      >
        Raw:<br />
        {collapsed() ? `{ ... }` : JSON.stringify(tweet(), null, 2)}
      </pre>
    </>
  )
}

const AnalyzeSection: Component = ({ selectedTalent, selectedTwitter }) => {
  const METRICS = 'https://developer.twitter.com/en/docs/twitter-api/metrics'
  const ENTERPRISE = 'https://developer.twitter.com/en/docs/twitter-api/enterprise/engagement-api/overview'

  let textRef, checkboxRef
  const [clicked, setClicked] = createSignal(false)
  const [parsedTweet, setParsedTweet] = createSignal(null)
  const [showUsageContainer, setShowUsageContainer] = createSignal(false)

  createEffect(() => {
    // Subscribe to selectedTwitter to ensure we clear the recently parsed tweet
    selectedTwitter()
    setParsedTweet(null)
    setShowUsageContainer(false)
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      twitterId: selectedTalent().twitter_user_id,
      tweetUrl: textRef.value,
      promoted: checkboxRef.checked
    }

    const result = await analyzeTweet(payload)

    setParsedTweet(result)
  }

  return(
    <Show when={clicked()} fallback={<AnalyzeButton selectedTwitter={selectedTwitter} setClicked={setClicked}/>}>
      <section class={styles.tweetSection}>
        <div class={styles.warningContainer} onclick={() => setShowUsageContainer(!showUsageContainer())}>
          <Show when={showUsageContainer()} fallback={<pre>Click to show usage instructions</pre>}>
            <strong class={styles.warningLabel}>Notes (June 2022)</strong>
            <p>
              The <Link href={ENTERPRISE} text="Engagements API" /> is a paid feature, as such <strong style="font-family: monospace">engagement_count</strong> cannot be retrieved.
            </p>
            <strong class={styles.warningLabel}>Known Issues</strong>
            <p>
              Tweets older than 30 days <Link href={METRICS} text="will return no metrics" /> from the Twitter API.<br />
              Checking <strong style="font-family: monospace">promoted</strong> for <strong>non-promoted</strong> tweets will return an error from the Twitter API.
            </p>
            <strong class={styles.warningLabel}>Usage</strong>
            <p>
              Fetch the impressions, link clicks, engagements {'&'} raw payload for a tweet. <br />
              1. Paste the URL of a tweet from <strong style="font-family: monospace">@{selectedTwitter().screen_name}</strong> in the field below.<br />
              2. Press enter while the text field is selected to submit the search.
            </p>
          </Show>
        </div>

        <form class={styles.tweetForm} onsubmit={handleSubmit}>
          <input style="width: 380px" type="text" ref={textRef} />
          <label for="promoted">
            <span>
              Promoted tweet?
              <input name="promoted" type="checkbox" ref={checkboxRef} />
            </span>
          </label>
        </form>
        <Show when={parsedTweet()}>
          <TweetResult tweet={parsedTweet}/>
        </Show>
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
