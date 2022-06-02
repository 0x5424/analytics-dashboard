import type {Component} from 'solid-js'
import {createSignal} from 'solid-js'

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

export const TalentActions: Component = ({selectedTalent}) => {
  const [clicked, setClicked] = createSignal(false)

  // Derived signals
  const url = () => `${API_URL_BASE}/v1/talents/${selectedTalent().id}/actions/redirect_twitter`
  const copyUrl = () => {
    navigator.clipboard.writeText(url());
  }
  const actionText = () => clicked() ? 'Copy URL' : 'Link Twitter'

  return (
    <>
      <div class={styles.wrapper}>
        <button class={styles.action} onclick={() => clicked() ? copyUrl() : setClicked(true)}>
          {actionText()}
        </button>
        {clicked() ? <UrlDescription url={url} /> : <InitialDescription selectedTalent={selectedTalent} />}
      </div>
    </>
  )
}
