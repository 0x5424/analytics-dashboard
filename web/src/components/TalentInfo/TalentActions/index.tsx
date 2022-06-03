import type {Component} from 'solid-js'

import {Twitter} from './Twitter'
import styles from './TalentActions.module.css'

export const TalentActions: Component = ({selectedTalent, selectedTwitter}) => {
  return (
    <>
      <div class={styles.wrapper}>
        <Twitter
          selectedTalent={selectedTalent}
          selectedTwitter={selectedTwitter}
        />
      </div>
    </>
  )
}
