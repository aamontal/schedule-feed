import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

export default class ResponsiveTable extends Component {

  renderHead(){
    const columns = _.map(this.props.columns, (colName) => {
      return (
        <th key={Math.random()}>{colName}</th>
      )
    })
    return (<tr>{columns}</tr>)
  }

  renderRows() {
    return _.map(this.props.rows, (row, index) => {
      const values = _.map(this.props.columns, (colName, colKey) => {
        return (
          <td key={Math.random()} data-label={colName}>
            {this.props.formatMap(colKey, row[colKey])}
          </td>
        )
      })
      return (
        <tr key={Math.random()}>{values}</tr>
      )
    })
  }

  render() {
    return (
      <table className="responsive-table">
        <thead>{this.renderHead()}</thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    )
  }
}

ResponsiveTable.propTypes = {
  rows:     PropTypes.array.isRequired,
  columns:  PropTypes.object.isRequired,
  formatMap:   PropTypes.func.isRequired,
}
