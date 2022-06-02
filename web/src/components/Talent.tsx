import type {Component} from 'solid-js'
import {Show, For, createResource, createSignal} from 'solid-js'

import {listenTalents, createTalent, updateTalentName} from '../utils/database'

import {TalentList} from './TalentList'
import {TalentInfo} from './TalentInfo'

/**
 * Contains Navbar (TalentList) and talent view (TalentInfo)
 */
export const Talent: Component = () => {
  const [talents, {mutate}] = createResource()
  listenTalents(mutate)

  const handleCreateNewTalent = (name) => {
    createTalent(name)
  }
  const [talentId, setTalentId] = createSignal(null, {equals: false})

  // Derived signal: current selectedTalent based on selected ID
  const selectedTalent = () => {
    if (!talents() || !talentId()) return null
    // Original reference is missing the ID
    const orig = talents()[talentId()]

    return {id: talentId(), ...orig}
  }

  return (
    <>
      {talents.loading ? <span>Loading...</span> : (
        <>
          <TalentList
            talentList={talents}
            handleCreateNewTalent={handleCreateNewTalent}
            setTalentId={setTalentId}
            selectedTalent={selectedTalent}
          />

          <TalentInfo
            selectedTalent={selectedTalent}
            updateTalentName={updateTalentName}
          />
        </>
      )}
    </>
  )
}
