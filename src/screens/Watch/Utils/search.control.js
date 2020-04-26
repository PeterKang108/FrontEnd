import _ from 'lodash'
import $ from 'jquery'

import { api, userAction } from '../../../utils'
import { setup } from './setup.control'
import { transControl } from "./trans.control"
import { videoControl } from "./player.control"

import { 
  SEARCH_INIT, 
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_HIDE, 
  SEARCH_BEGIN, 
  SEARCH_RESULT, 
  SEARCH_PAGE_NUM,
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS,
  SEARCH_IN_SHORTCUTS
} from "./constants.util"

import { shortcuts } from './data'

/**
 * Functions for controlling user preference
 */

export const searchControl = {
  search_: SEARCH_INIT,
  // used to determine whether already has a result ot not
  hasResult: false,
  // Function used to set search state
  setSearch: function() {}, 

  // Function used to set up the external objects & functions used by searching
  init: function({ setSearch }) {
    if (setSearch) this.setSearch = setSearch
  },

  // Function used to update `search` state
  updateSearch: function(search) {
    let newSearch = { ...this.search_, ...search }
    this.search_ = newSearch
    this.setSearch(newSearch)
  },

  // Function used to open search
  openSearch: function() {
    if (this.search_.status !== SEARCH_HIDE ) return $('#watch-search-input').focus()

    let status = this.hasResult ? SEARCH_RESULT : SEARCH_BEGIN 
    this.updateSearch({ status })
  },

  // Function used to close search
  closeSearch: function() {
    if (this.search_.status === SEARCH_HIDE) return;
    this.updateSearch({ status: SEARCH_HIDE })
  },

  // Function used to auto handle close or open search
  handleOpen: function(bool) {
    if (bool === undefined) {
      if (this.search_.status === SEARCH_HIDE) this.openSearch()
      else this.closeSearch()
    } else {
      if (Boolean(bool)) this.openSearch()
      else this.closeSearch()
    }
  },

  // Function used to reset search value & results
  resetResult: function() {
    this.updateSearch({ 
      inVideoTransResults: ARRAY_INIT, 
      inVideoTransResultsAfterCurrent: ARRAY_INIT, 
      inVideoTransResultsBeforeCurrent: ARRAY_INIT,
      inCourseTransResults: ARRAY_INIT,
      playlistResults: ARRAY_INIT,
      value: '', 
      status: SEARCH_BEGIN 
    })

    this.hasResult = false
  },

  /**
   * Functions for get search results
   */

  // Function used to get RegExp tests for provided value
  getRegExpTests: function(value='', key='text', flags='i') {
    let tests = []
    // get test functions for each word
    value.split(' ').forEach(word => {
      let reg = new RegExp(_.escapeRegExp(word), flags)
      let testFunc = result => reg.test(_.get(result, key))
      tests.push({ word, testFunc, reg })
    })

    return tests
  },

  // Function used to get the match function 
  // which is used to determine whether an text is the result or not
  getMatchFunction: function(value='', key='text', flags='i') {
    let tests = this.getRegExpTests(value, key, flags)
    // combine the test result
    let isMatch = result => {
      let match = true
      tests.forEach( test => match = match && test.testFunc(result))
      return match
    }

    return isMatch
  },

  // Function used to add <span> tag around the searched value in a text
  highlightSearchedWords: function(results=[], value='', key='text') {
    let tests = this.getRegExpTests(value, key, 'gi')
    return results.map( res => {
      let text = _.get(res, key).toLowerCase()
      tests.forEach( test => {
        if (test.testFunc(res)) {
          text = _.replace(text, test.reg, `<span>${test.word}</span>`)
        }
      })
      return _.set(_.clone(res), key, text)
    })
  },

  // Function used to get search results from captions in current video
  getInVideoTransSearchResults: function(value) {
    if (value === undefined) return this.search_
    let captions = transControl.transcript()
    if (!value || captions === ARRAY_EMPTY) {
      return []
    }
    let isMatch = this.getMatchFunction(value, 'text')

    let inVideoTransResults = this.highlightSearchedWords(
      _.filter(captions, isMatch), 
      value
    )
    // if (inVideoTransResults.length === 0) inVideoTransResults = ARRAY_EMPTY

    return inVideoTransResults
  },

  // Function used to convert HH:MM:SS format into seconds
  hmsToSecondsOnly: function(str) {
    var p = str.split(':'),
        s = 0, m = 1;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
  },

  // Function used to get search results from captions in current video (after current time)
  getInVideoTransSearchResultsAfterCurrent: function(value) {
    // get the currentTime to divide inVideoTransResults into 2 parts
    let currentTime = videoControl.videoNode1.currentTime
    let inVideoTransResults = this.getInVideoTransSearchResults(value)
    let inVideoTransResultsAfterCurrent = inVideoTransResults.filter((caption, index) => {return currentTime >= this.hmsToSecondsOnly(caption.begin)})
    return inVideoTransResultsAfterCurrent;
  },

  // Function used to get search results from captions in current video (before current time)
  getInVideoTransSearchResultsBeforeCurrent: function(value) {
    // get the currentTime to divide inVideoTransResults into 2 parts
    let currentTime = videoControl.videoNode1.currentTime
    let inVideoTransResults = this.getInVideoTransSearchResults(value)
    let inVideoTransResultsBeforeCurrent = inVideoTransResults.filter((caption, index) => {return currentTime < this.hmsToSecondsOnly(caption.begin)})
    return inVideoTransResultsBeforeCurrent;
  },

  // Function used to get search results from captions in current offering
  getInCourseTransSearchResults: async function(value) {
    const { offeringId } = setup.playlist()
    if (!offeringId) return []

    try {
      const { data } = await api.searchCaptionInOffering(offeringId, value)
      return data
    } catch (error) {
      console.error('Failed to get in-course trans search results')
      return []
    }
  },

  // Function used to get search results from videos in current offering
  getPlaylistResults: async function(value) {
    const { offeringId } = setup.playlist()
    if (!offeringId) return []

    try {
      let { data } = await api.searchForMedia(offeringId, value)
      // console.log('playlistResults', data)
      return data
    } catch (error) {
      console.error(error, 'Failed to get media results')
      return []
    }
  },

  getShortcutResults: function(value) {
    let shortcuts_ = shortcuts.map( catag => catag.rows )
    shortcuts_ = _.flatten(shortcuts_)
    let isMatch = this.getMatchFunction(value, 'action')
    let shortcutResults = _.filter(shortcuts_, isMatch)
    // console.log('shortcuts_', shortcutResults)
    return shortcutResults
  },

  // Function used to get search results from captions and videos
  getResults: async function(value) {
    if (!value) return this.resetResult()
    let inVideoTransResults = this.getInVideoTransSearchResults(value)
    let inVideoTransResultsAfterCurrent = this.getInVideoTransSearchResultsAfterCurrent(value)
    let inVideoTransResultsBeforeCurrent = this.getInVideoTransSearchResultsBeforeCurrent(value)
    let shortcutResults = this.getShortcutResults(value)
    this.updateSearch({ 
      value,
      status: SEARCH_RESULT, 
      inVideoTransResults, 
      inVideoTransResultsAfterCurrent,
      inVideoTransResultsBeforeCurrent,
      shortcutResults,
      playlistResults: ARRAY_INIT,
      inCourseTransResults: ARRAY_INIT
    })
    let playlistResults = await this.getPlaylistResults(value)
    this.updateSearch({ playlistResults })
    let inCourseTransResults = await this.getInCourseTransSearchResults(value)
    this.updateSearch({ inCourseTransResults })
    this.hasResult = true

    await userAction.filtertrans(value)
  },

  /**
   * Helper functions
   */

  // Function used to get the number of results
  resultNum: function(results) {
    if (results === ARRAY_INIT || results === ARRAY_EMPTY) return 0
    return results.length
  },

  // Function used to get the options for results
  getResultOptions: function(search=SEARCH_INIT, currOpt=SEARCH_TRANS_IN_VIDEO) {
    const { 
      inVideoTransResults=[], 
      inCourseTransResults=[], 
      playlistResults=[], 
      shortcutResults=[],
    } = search

    const optNumMap = {
      [SEARCH_TRANS_IN_VIDEO]: [inVideoTransResults, 'caption', 'video'],
      [SEARCH_IN_PLAYLISTS]: [playlistResults, 'video title', 'course'],
      [SEARCH_TRANS_IN_COURSE]: [inCourseTransResults, 'caption', 'course'],
      [SEARCH_IN_SHORTCUTS]: [shortcutResults, 'shortcut', 'page']
    }

    let options = [SEARCH_TRANS_IN_VIDEO, SEARCH_IN_PLAYLISTS, SEARCH_TRANS_IN_COURSE]
    // if (this.resultNum(shortcutResults)) 
    options.push(SEARCH_IN_SHORTCUTS)
    
    return options.map( opt => {
      let [res, name, range] = optNumMap[opt]
      let num = this.resultNum(res)
      let init = res === ARRAY_INIT
      return {
        opt, num, init,
        current: opt === currOpt,
        content: `${num >= 100 ? '99+' : num} ${name}${num > 1 ? 's' : ''} in this ${range}`
      }
    })
  },

  // Function used to get the total page num based on a result's length
  totalPageNum: function(resultLen=0) {
    return resultLen === 0 ? 1 : Math.ceil(resultLen / SEARCH_PAGE_NUM)
  },

  // Function used to determine whether an item is in current page
  isInCurrentPage: function(page=0, index=0) {
    return (index < page * SEARCH_PAGE_NUM) && (index >= (page-1)*SEARCH_PAGE_NUM)
  },

}