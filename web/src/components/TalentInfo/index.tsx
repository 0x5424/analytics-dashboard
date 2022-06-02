import type {Component} from 'solid-js'

import {TalentName} from './TalentName'
import {TalentActions} from './TalentActions'
import styles from './TalentInfo.module.css'

export const TalentInfo: Component = ({selectedTalent, updateTalentName}) => {
  return (
    <div class={styles.container}>
      {selectedTalent() ?
        (<>
          <TalentName
            selectedTalent={selectedTalent}
            updateTalentName={updateTalentName}
          />
          <TalentActions
            selectedTalent={selectedTalent}
          />
          <pre>
            {JSON.stringify(selectedTalent(), null, 2)}
          </pre>
        </>) : <pre>No talent selected.</pre>}
    </div>
  )
}
