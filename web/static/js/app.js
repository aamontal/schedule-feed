import React from "react"
import ReactDOM from "react-dom"
import ResponsiveTable from './responsive-table.js'

class ScheduleFeedDepartures extends React.Component {

  constructor(props) {
    super(props)
    this.state = {schedule: [], filter: '', interval: null}
    this.previousSearch = null
    this.previousTimer = null
  }

  getDefaultProps() {
    return {
      intervalTime: 3000
    }
  }

  columnNames() {
    return {
      ScheduledTime: "Scheduled Time",
      Destination: "Destination",
      Origin: "Origin",
      Trip: "Train #",
      Track: "Track #",
      Status: "Status"
    }
  }

  foramtStatus(status) {
    switch(status) {
    case "On Time":
      return (<span className='green'>{status}</span>)
    case "Now Boarding":
      return (<span className="blink_me">{status}</span>)
    case "All Aboard":
      return (<strong className="blink_me">{status}</strong>)
    case "Cancelled":
      return (<span className='red'>{status}</span>)
    default:
      return status
    }
  }

  formatMap(column, value) {
    const action = {
      ScheduledTime:  this.formatTime,
      TimeStamp:      this.formatDate,
      Status:         this.foramtStatus,
      Track:          (track) => { return Boolean(track) ? track : "TBD" }
    }

    if(action[column])
      return action[column](value)
    else
      return value
  }

  formatDate(unixtime) {
    const newDate = new Date()
    newDate.setTime(Number(unixtime) * 1000)
    return <span>{newDate.toLocaleString()}</span>
  }

 formatTime(unixtime) {
    const newDate = new Date()
    newDate.setTime(Number(unixtime) * 1000)
    return <span>{newDate.toLocaleTimeString()}</span>
  }

  componentDidMount() {
    this.fetchSchedule()
  }

  setSchedule(schedule) {
    const filteredSchedule = schedule.filter((s) => {
      if(this.state.filter){
        return s.Destination.toLowerCase().includes(this.state.filter)
      } else {
        return true
      }
    })
    this.setState({schedule: filteredSchedule})
  }

  fetchSchedule() {
    $.getJSON('/api/sample_feed.json')
      .done(this.setSchedule.bind(this))
      .fail(() => {
        alert("Error fetching departures, please try again")
      })
  }

  handleKeyPress(e) {
    let value = e.target.value

    const filterSearch = (filterValue) => {
      this.setState({filter: filterValue.toLowerCase()})
      this.fetchSchedule()
    }

    //prevent racecondition in case server is slow
    this.previousSearch && this.previousSearch.abort()
    clearTimeout(this.previousTimer)

    //give user sometime to type
    this.previousTimer = setTimeout( () =>
      filterSearch(value),
      500
    )

  }

  handlePollChange(e) {
    if(e.target.checked){
      let interval = setInterval(this.fetchSchedule.bind(this), parseInt(this.props.intervalTime))
      this.setState({interval: interval})
    } else {
      clearInterval(this.state.interval)
    }
  }

  now() {
    const today = new Date()
    const day = today.toLocaleString('en-us', {  weekday: 'long' })
    const date = today.toLocaleDateString('en-us')
    return `${day} ${date}`
  }

  searchInput() {
    return(
      <div className="right">
        <label htmlFor="search" className="control-label spread">Destination Search:</label>
        <input name="search" type="text" onKeyUp={this.handleKeyPress.bind(this)} />
      </div>
    )
  }

  header() {
    return(
      <div className="container">
        <div className="spread">
          <span>{this.now()}</span>
        </div>
        <div className="top spread">DEPARTURE INFORMATION</div>
        <div className="spread">
          <label htmlFor="isPolling" className="control-label">Last Updated:</label>
          <span className="spread" name="lastUpdated"><em>{ new Date().toLocaleTimeString() }</em></span>
        </div>
      </div>
    )
  }

  polling() {
    return(
     <div className="spread">
        <label htmlFor="isPolling" className="control-label">Auto-refresh:</label>
        <span className="spread">
        <input
          name="isPolling"
          type="checkbox"
          checked={this.state.poll}
          onChange={this.handlePollChange.bind(this)} />
        </span>
      </div>
    )
  }

  render() {
    const {schedule} = this.state
    console.log(schedule)

    return (
      <div>
        {this.header()}
        <div className="container">
          {this.searchInput() }
          {this.polling()}
        </div>

        <ResponsiveTable rows={schedule} columns={this.columnNames()} format={this.formatMap.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(
  <ScheduleFeedDepartures intervalTime="5000" />,
  document.getElementById("departureApp")
)
