// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import React from "react"
import ReactDOM from "react-dom"
import _ from 'lodash'
import ResponsiveTable from './responsive-table.js'

class ScheduleFeedDepartures extends React.Component {

  constructor(props) {
    super(props)
    this.state = {schedule: [], filter: ''}

    this.previousSearch = null
    this.previousTimer = null
  }

  headers() {
    return {
      Destination: "Destination",
      Lateness: "Lateness",
      Origin: "Origin",
      ScheduledTime: "Scheduled Time",
      Status: "Status",
      TimeStamp: "Time Stamp",
      Track: "Track",
      Trip: "Trip"
    }
  }


  foramtStatus(status) { 
    if(status == "On Time")
      return (<span className='green'>{status}</span>)
    else
      return status
  }
  formatMap(column, value) {
    const action = {
      ScheduledTime:  this.formatTime,
      TimeStamp:      this.formatTime,
      Status:         this.foramtStatus,
    }

    if(action[column])
      return action[column](value)
    else
      return value
  }

  formatTime(unixtime) {
    const newDate = new Date();
    newDate.setTime(Number(unixtime) * 1000);
    return <span>{newDate.toLocaleString()}</span>
    
  }

  componentDidMount() {
    this.fetchSchedule()
  }


  fetchSchedule(callback) {
    const setSchedule = (schedule) => { 
      const self = this
      const filteredSchedule = _.filter(schedule, (s) => {
        if(self.state.filter){
          return s.Destination.toLowerCase().includes(self.state.filter)
        } else {
          return true
        }
      })
  
      self.setState({schedule: filteredSchedule})
      if(Boolean(callback)) callback()
    }

    this.previousSearch && this.previousSearch.abort()
    clearTimeout(this.previousTimer);

    this.previousTimer = setTimeout( () =>
      $.getJSON('/api/sample_feed.json', setSchedule),
      300
    )
  }

  handleKeyPress(e) { 
    this.setState({filter: e.target.value.toLowerCase()})
    this.fetchSchedule()
  }

  render() {
    const {schedule} = this.state;
    console.log(schedule);

    return (
      <div>
        <div>MBTA Departures</div>
        <span>Destination: <input type="text" onKeyUp={this.handleKeyPress.bind(this)} /></span>
        <ResponsiveTable rows={schedule} columns={this.headers()} format={ this.formatMap.bind(this) } />
      </div>
    )
  }
}

ReactDOM.render(
  <ScheduleFeedDepartures />,
  document.getElementById("departureApp")
)
