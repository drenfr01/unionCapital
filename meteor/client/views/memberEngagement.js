/* global MemberEngagementData */
/* global R */

import React, { PropTypes } from 'react';
import { VictoryBar, VictoryAxis, VictoryChart } from 'victory';
import { BarChart } from 'rd3';

const availableGroupings = {
  'gender': 'Gender',
  'zip': 'Zip',
  'race': 'Race',
};

function getAvailableGroupingIds() {
  return Object.keys(availableGroupings);
}

function getDefaultGroupingId() {
  return getAvailableGroupingIds()[0];
}

function getDefaultPartnerOrg() {
  return 'Nurtury';
  //return Meteor.user().profile.partnerOrg;
}

function getDisplayLabelForGroupingId(groupingId) {
  return availableGroupings[groupingId];
}

const MemberEngagementChart = React.createClass({
  propTypes: {
    refreshChartData: PropTypes.func.isRequired,
    chartData: PropTypes.array.isRequired,
  },

  getInitialState: function() {
    return {
      field: getDefaultGroupingId(),
      partnerOrg: getDefaultPartnerOrg(),
    };
  },

  componentDidMount: function() {
    this.refreshData();
  },

  refreshData: function() {
    const { field, partnerOrg } = this.state;
    this.props.refreshChartData(field, partnerOrg);
  },

  updateField: function(event) {
    const { partnerOrg } = this.state;
    const field = event.target.value;
    console.log(field);
    this.setState({ field });
    this.props.refreshChartData(field, partnerOrg);
  },

  updateParterOrg: function(event) {
    const { field } = this.state;
    const partnerOrg = event.target.value;
    this.setState({ partnerOrg });
    this.props.refreshChartData(field, partnerOrg);
  },

  render: function() {
    const { field, partnerOrg } = this.state;
    const { chartData } = this.props;

    const selectedData = R.compose(
      R.values,
      //R.mapObjIndexed((val, key) => ({ x: key, y: val })),
      R.mapObjIndexed((val, key) => ({ name: key, values: [{ x: key, y: val }] })),
      R.propOr({}, 'chartData'),
      R.propOr({}, field),
      R.tap(console.log.bind(console)),
      R.find(R.propEq('_id', partnerOrg))
    )(chartData);

    const bar = selectedData.length
      ? <VictoryBar data={ selectedData } />
      : null;

    const fieldOptions = R.compose(
      R.values,
      R.mapObjIndexed(function(displayName, groupingId) {
        return (
          <option key={ groupingId } value={ groupingId }>{ displayName }</option>
        );
      })
    )(availableGroupings);

    console.log(selectedData);

    return (
      <div>
        <select onChange={ this.updateField }>
          { fieldOptions }
        </select>
        <select onChange={ this.updateParterOrg }>
          <option>Nurtury</option>
        </select>
        { selectedData.length &&
          <BarChart
            data={ selectedData }
            width={ 500 }
            height={ 200 }
            fill={'#3182bd'}
            title='Bar Chart'
            yAxisLabel='Label'
            xAxisLabel='Value'
          />
        }
      </div>
    );
  },
});


Template.memberEngagement.onCreated(function() {
  this.subscribe('memberEngagementData');
  this.subscribe('partnerOrganizations');
});

Template.memberEngagement.helpers({
  MemberEngagementChart: function() {
    return MemberEngagementChart;
  },

  refreshChartData: function() {
    return function refreshChartData(field, partnerOrg) {
      Meteor.call('refreshChartData', field, partnerOrg, function(err) {
        // TODO: Add error handling
        if (err) {
          console.log(err);
        }
      });
    };
  },

  chartData: function() {
    return MemberEngagementData.find().fetch();
  },
});
