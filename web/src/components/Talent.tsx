import type {Component} from 'solid-js'
import {Show, For, createResource, createSignal} from 'solid-js'

import {listenTalents, createTalent} from '../utils/database'

import { TalentList } from './TalentList'

/**
 * Contains Navbar (TalentList) and talent view (TalentInfo)
 */
export const Talent: Component = () => {
  const [talents, {mutate}] = createResource()
  listenTalents(mutate)

  const [newTalentName, setNewTalentName] = createSignal('')
  const handleCreateNewTalent = () => {
    createTalent(newTalentName())
    setNewTalentName('')
  }
  const [selectedTalent, selectNewTalent] = createSignal(null)

  return (
    <>
      {talents.loading ? <span>Loading...</span> : (
        <>
          <TalentList
            talentList={talents}
            newTalentName={newTalentName}
            setNewTalentName={setNewTalentName}
            handleCreateNewTalent={handleCreateNewTalent}
            selectNewTalent={selectNewTalent}
            selectedTalent={selectedTalent}
          />
          <button onclick={() => console.log(selectedTalent())}>
            Who is selected!??!?!?
          </button>
        </>
      )}
    </>
  )
}
