/**
 * Home sub-screen for Offering Viewing screen
 */

import React from 'react';
import _ from 'lodash';
// UI
import { CTFooter } from 'layout';
import { MaintenanceMessage } from 'components';
import { api, user, util, links, prompt } from 'utils';
import './index.css';

import Filter from './Filter';
import SectionList from './SectionList';

export class Feed extends React.Component {
  constructor(props) {
    super(props);
    links.title();
    this.state = {
      universities: [],
      terms: [],
      departments: ['unloaded'],

      uniSelected: '',
      departSelected: [],
      termSelected: [],
    };
  }

  componentDidMount() {
    /**
     * Get all universities
     */
    api
      .getUniversities()
      .then(({ data }) => {
        this.setState({ universities: data.filter((uni) => uni.id !== '0000') });
        api.contentLoaded();
      })
      .catch(() => {
        api.contentLoaded();
        prompt.addOne({
          text: "Couldn't load universities.",
          refresh: true,
          position: 'top',
          status: 'error',
        });
      });
    if (user.isLoggedIn) {
      const userUniId = user.getUserInfo().universityId;
      if (userUniId !== '0000') this.onUniSelected(null, { value: userUniId });
      else this.onUniSelected(null, {});
    } else {
      this.onUniSelected(null, {});
    }
    util.fixForAccessbitity('widgets/scripts');
    util.fixForAccessbitity('formSearchDropdown');

    // homeUserGuide.start()
  }

  getDepartmentsByUniId = (uniId) => {
    api
      .getDepartsByUniId(uniId)
      .then(({ data }) => {
        this.setState({ departments: data, departSelected: [] });
      })
      .catch(() => {
        this.setState({ departments: ['retry'] });
      });
  };

  getTermsByUniId = (uniId) => {
    api.getTermsByUniId(uniId).then(({ data }) => {
      this.setState({ terms: data, termSelected: [] });
    });
  };

  onUniSelected = (e, { value }) => {
    if (!value) {
      api.getDepartments().then(({ data }) => {
        data.forEach((depart) => {
          const uni = _.find(this.state.universities, { id: depart.universityId });
          if (uni) depart.uniName = uni.name;
        });
        this.setState({ departments: data });
      });
    } else {
      this.getDepartmentsByUniId(value);
      this.getTermsByUniId(value);
    }
    this.setState({ terms: [], departments: ['unloaded'], uniSelected: value });
  };

  onDepartSelected = (e, { value }) => {
    this.setState({ departSelected: value });
  };

  onTermSelected = (e, { value }) => {
    this.setState({ termSelected: value });
  };

  render() {
    const { starOffering, unstarOffering, state } = this.props;
    const { displaySearchHeader, starredOfferings, offerings } = state;

    return (
      <>
        <MaintenanceMessage />
        <Filter {...this} displaySearchHeader={displaySearchHeader} />
        <SectionList
          {...this}
          offerings={offerings}
          starOffering={starOffering}
          unstarOffering={unstarOffering}
          starredOfferings={starredOfferings}
        />
        <CTFooter />
      </>
    );
  }
}
