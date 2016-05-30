/* global MemberEngagementData */
/* global R */

/*
 * event category
 * by org checkbox
 */

import React, { PropTypes } from 'react';
import Chart from './Chart';
import { BarChart } from 'rd3';

const availableGroupings = {
  'gender': 'Gender',
  'zip': 'Zip',
  'race': 'Race',
  'partnerOrg': 'Partner Org',
  'approvalType': 'Approval Type',
  'category': 'Category',
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

function getSelectedData(chartData, field, partnerOrg) {
  return R.compose(
    R.values,
    R.mapObjIndexed((val, key) => ({ x: key, y: val, label: key })),
    R.propOr({}, 'chartData'),
    R.propOr({}, field),
    R.find(R.propEq('_id', partnerOrg))
  )(chartData);
}

function getOptionFragment(displayName, groupingId) {
  return <option key={ groupingId } value={ groupingId }>{ displayName }</option>;
}

function getFieldOptions(groupings) {
  return R.compose(
    R.values,
    R.mapObjIndexed(getOptionFragment)
  )(groupings);
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

    const selectedData = getSelectedData(chartData, field, partnerOrg);
    const fieldOptions = getFieldOptions(availableGroupings);

    return (
      <div className="engagement-container">
        <div className="row">
          <div className="col-xs-4 col-xs-offset-2">
            <select className="form-control" onChange={ this.updateField }>
              { fieldOptions }
            </select>
          </div>
          <div className="col-xs-4">
            <select className="form-control" onChange={ this.updateParterOrg }>
              <option>Nurtury</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <Chart
              chartData={ selectedData }
              xAxisLabel={ field }
              yAxisLabel={ '' }
            />
          </div>
        </div>
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
