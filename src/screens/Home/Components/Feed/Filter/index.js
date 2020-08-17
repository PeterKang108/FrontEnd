/**
 * Filter component
 * - filter by university, terms, departments
 */

import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown, Form, Grid } from 'semantic-ui-react';
import { util } from 'utils';
import './index.css';

function Filter({
  state,
  onUniSelected,
  onDepartSelected,
  onTermSelected,
  history,
}) {
  const { universities, departments, terms, uniSelected } = state;

  // get selecting options
  const uniOptions = util.getSelectOptions(universities);
  const termOptions = util.getSelectOptions((terms || []).slice().reverse(), 'term');
  const departOptions = departments[0] === 'unloaded' 
                      ? [] 
                      : util.getSelectOptions(departments, 'depart');

  const termStyle = terms.length ? {} : { display: 'none' };
  return (
    <div className="sp-filter ct-a-fade-in">
      <Form>
        <Grid stackable columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                id="filter-by-university"
                title="Filter by University"
                control={Dropdown}
                placeholder="Select University"
                label="Filter by University"
                aria-label="Select University"
                clearable
                selection
                search
                value={uniSelected}
                options={uniOptions}
                onChange={onUniSelected}
              />
            </Grid.Column>

            <Grid.Column>
              <Form.Field
                control={Dropdown}
                id="filter-by-departments"
                placeholder="Select Departments"
                label="Filter by Departments"
                aria-label="Select Departments"
                clearable
                selection
                multiple
                search
                options={departOptions}
                onChange={onDepartSelected}
              />
            </Grid.Column>

            <Grid.Column style={termStyle}>
              <Form.Field
                id="filter-by-terms"
                title="Filter by Terms"
                control={Dropdown}
                placeholder="Select Terms"
                label="Filter by Terms"
                aria-label="Select Terms"
                clearable
                selection
                multiple
                search
                options={termOptions}
                onChange={onTermSelected}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Button for satisfy the WCAG Rule, with no actral use */}
        <Form.Button className="accessbility_hide">Search</Form.Button>
      </Form>
    </div>
  );
}

export default withRouter(Filter);
