import type {Component} from 'solid-js'
import {Show, createSignal, createEffect} from 'solid-js'

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
    <Show when={!selectedTwitter()} fallback={<pre>Twitter linked</pre>}>
      <button class={styles.action} onclick={() => clicked() ? navigator.clipboard.writeText(url()) : setClicked(true)}>
        {actionText()}
      </button>
      {clicked() ? <UrlDescription url={url} /> : <InitialDescription selectedTalent={selectedTalent} />}
    </Show>
  )
}
