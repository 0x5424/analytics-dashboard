import type {Component} from 'solid-js'
import {Show, For, createResource, createSignal} from 'solid-js'

import {listenTalents, listenTwitters, createTalent, updateTalentName} from '../utils/database'

import {TalentList} from './TalentList'
import {TalentInfo} from './TalentInfo'

/**
 * Contains Navbar (TalentList) and talent view (TalentInfo)
 */
export const Talent: Component = () => {
  const [talents, {mutate: talentsMutate}] = createResource()
  const [twitters, {mutate: twittersMutate}] = createResource()
  listenTalents(talentsMutate)
  listenTwitters(twittersMutate)

  const handleCreateNewTalent = (name) => createTalent(name)
  const [talentId, setTalentId] = createSignal(null, {equals: false})

  // Derived signal: current selectedTalent based on selected ID
  const selectedTalent = () => {
    if (!talents() || !talentId()) return null
    // Original reference is missing the ID
    const orig = talents()[talentId()]

    return {id: talentId(), ...orig}
  }

  // Derived signal: current selectedTwitter based on selectedTalent
  const selectedTwitter = () => {
    console.log('[selectedTwitter] Invoked')
    if (!selectedTalent() && !selectedTalent().twitter_user_id) return null

    return twitters()[selectedTalent().twitter_user_id]
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
            selectedTwitter={selectedTwitter}
            updateTalentName={updateTalentName}
          />
        </>
      )}
    </>
  )
}
