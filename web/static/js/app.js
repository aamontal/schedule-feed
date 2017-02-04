import React from "react"
import ReactDOM from "react-dom"
import ResponsiveTable from './responsive-table.js'
import _ from "lodash"

class ScheduleFeedDepartures extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      schedule: [],
      filter: '',
      interval: null,
      poll: props.polling
    }
    this.previousSearch = null
    this.previousTimer = null
  }

  addEstDeparture(row) {
    const estDeparture = Number(row.ScheduledTime) + Number(row.Lateness)
    return _.assign(row, {EstDeparture: estDeparture})
  }

  columnNames() {
    return {
      ScheduledTime: "Scheduled Time",
      Destination: "Destination",
      Origin: "Origin",
      Trip: "Train",
      Track: "Track",
      Status: "Status",
      EstDeparture: "Estimated",
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
    case "Late":
      return (<span className='red'>{status}</span>)
    default:
      return status
    }
  }

  formatMap(column, value) {
    const action = {
      ScheduledTime:  this.formatTime,
      EstDeparture:  this.formatTime,
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
    this.togglePolling(this.state.poll)
  }

  setSchedule(schedule) {
    const filteredSchedule = schedule.filter((s) => {
      if(this.state.filter){
        return s.Destination.toLowerCase().includes(this.state.filter)
      } else {
        return true
      }
    })

    const revSchedule = filteredSchedule.map(this.addEstDeparture.bind(this))
    this.setState({schedule: revSchedule})
  }

  fetchSchedule() {
    $.getJSON(this.props.endpoint)
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

  togglePolling(check) {
     if(check){
      let interval = setInterval(this.fetchSchedule.bind(this), parseInt(this.props.intervalTime))
      this.setState({interval: interval, poll: true})
    } else {
      this.setState({poll: false})
      clearInterval(this.state.interval)
    }
  }

  handlePollChange(e) {
    this.togglePolling(e.target.checked)
  }

  handleButtonClick(e) {
    e.preventDefault()
    this.fetchSchedule()
  }

  now() {
    const today = new Date()
    const day = today.toLocaleString('en-us', {  weekday: 'long' })
    const date = today.toLocaleDateString('en-us')
    return `${day} ${date}`
  }

  searchInput() {
    return(
      <div className="spread">
        <input name="search" type="text" onKeyUp={this.handleKeyPress.bind(this)} />
        <button onClick={this.handleButtonClick.bind(this)}>search</button>
      </div>
    )
  }

  header() {
    return(
      <div className="flexContainer">
        <div className="spread">
          <label htmlFor="today" className="control-label">Today:</label>
          <span name="today" className="spread">{this.now()}</span>
        </div>
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
    console.log("rendering...", schedule.length)
    return (
      <div>
        {this.header()}
        <div className="flexContainer">
          {this.searchInput() }
        </div>

        <ResponsiveTable rows={schedule} columns={this.columnNames()} format={this.formatMap.bind(this)} />
      </div>
    )
  }
}

const Params = function(queryString) {
  this.params = queryString
  this.getBoolean = (value) => { return this.params[value] === 'true' }
  this.polling = () => { return Boolean(this.getBoolean("polling")) }
}

Params.of = (queryString) => { return new Params(queryString) }

const params = Params.of(window.APP_PARAMS)

ReactDOM.render(
  <ScheduleFeedDepartures
    intervalTime={ 5000 }
    polling={params.polling()}
    endpoint={window.APP_API_DEPART}
  />, document.getElementById("departureApp")
)
