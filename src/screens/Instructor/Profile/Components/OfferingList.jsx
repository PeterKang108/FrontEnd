/**
 * Component for Instructor Profile Page
 * - contents the course-info Card and the offering list
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Tab, Card, Button, Divider, Popup, Message } from 'semantic-ui-react'
import { sortFunc, util, handleData } from 'utils'

/**
 * @param courseOffering one course and its offerings
 * @param onSort callback for sorting the offerings by term
 */
export default function OfferinfList({courseOffering, onSort, sortDown, terms, department, isMobile}) {
  const { course, offerings } = courseOffering
  // determine the sorting method and sort the offering array
  const sortBy = sortDown ? sortFunc.sortDownByTerm : sortFunc.sortUpByTerm
  const sortedOfferings = offerings.slice().sort(sortBy)
  const courseFullNumber = department.acronym + course.courseNumber
  
  return (
    <Tab.Pane className="sp-pane" style={{background: 'none'}} key={course.id}>
      <CourseInfoCard {...courseOffering} department={department} courseFullNumber={courseFullNumber}/>

      {!isMobile && <OfferingTitle onSort={onSort} sortDown={sortDown} />}

      <div style={{width: '100%'}}>
        {sortedOfferings.map( offering => {
          const term = handleData.findById(terms, offering.termId)
          return (
            <Link to={util.links.offering(offering.id)} key={offering.id}>
              <Message 
                className='offering-listitem'
                title={`go to ${courseFullNumber} page`}
                aria-label={`go to ${courseFullNumber} page`}
              >
                  <Grid stackable>
                    <Grid.Row className="offering-info">
                      <Grid.Column className="course-num" width={3}>
                        <h3>{courseFullNumber}</h3>
                      </Grid.Column>
                      <Grid.Column width={5}><strong>{term ? term.name : ''}</strong></Grid.Column>
                      <Grid.Column width={5}><strong>{offering.sectionName}&ensp;</strong></Grid.Column>
                    </Grid.Row>
                  </Grid>
              </Message>
            </Link>
          )
        })}
      </div>
    </Tab.Pane>
  )
}

/**
 * Card Component showing the info of a course
 */
function CourseInfoCard({course, department, courseFullNumber}) {
  const cardStyle = {width: '100%', textAlign: 'left', }
  return (
    <Card className="course-info" fluid>
      <Card.Content style={cardStyle}>
        <h2>{courseFullNumber}&ensp;</h2>
        <h5>{course.courseName}</h5>

        <Divider />          
        <p><strong>Department: </strong>{department.name}</p>
        <p><strong>Description: </strong>{course.description}</p>
      </Card.Content>
    </Card>
  )
}

/**
 * The component showing titles for the offering list
 */
function OfferingTitle({sortDown, onSort}) {
  const iconName = sortDown ? "sort up" : "sort down"
  return (
    <Grid style={{width: '100%', margin: '0 0 .1rem 1rem'}}>
      <Grid.Row columns={4} verticalAlign="middle">
        <Grid.Column width={3}>
          <p className="subtitle-courses">Course</p>
        </Grid.Column>
        <Grid.Column width={5}>
          <p className="subtitle-offerings">
            Offering Term&ensp;
            <Popup inverted content='Sort offerings by term' trigger={
              <Button 
                compact size="mini"
                onClick={onSort} 
                icon={iconName} 
                title="sort offerings by term"
                aria-label="sort offerings by term"
              />
            }/>
          </p>
        </Grid.Column>
        <Grid.Column width={3}>
          <p >Section</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}