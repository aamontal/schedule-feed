import React from "react"
import ReactDOM from "react-dom"
import _ from 'lodash'

export default class ResponsiveTable extends React.Component {
  head(){
    var columns = _.map(this.props.columns, function(colName) {
      return (
        <th>{colName}</th>
      );
    });
    return (
      <tr>{columns}</tr>
    );
  }
  
  rows(){
    var _this = this;
    return _.map(_this.props.rows, function(row, index) {
      var values = _.map(_this.props.columns, function(colName, colKey) {
        return (
          <td data-label={colName}>{_this.props.format(colKey, row[colKey])}</td>
        );
      })
      return (
        <tr key={index}>{values}</tr>
      );
    })
  }
  
  render() {
    return (
      <table className="responsive-table">
        <thead>
          {this.head()}
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    );
  }
}