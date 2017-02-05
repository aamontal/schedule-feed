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

  componentDidMount() {
    this.executeSearch(this.fetchSchedule.bind(this))
    this.togglePolling(this.state.poll)
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

  formatMap(column, value) {

    const formatStatus = (status) => {
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

    const formatDate = (unixtime) => {
      const newDate = new Date()
      newDate.setTime(Number(unixtime) * 1000)
      return <span>{newDate.toLocaleString()}</span>
    }

    const formatTime = (unixtime) => {
      const newDate = new Date()
      newDate.setTime(Number(unixtime) * 1000)
      return <span>{newDate.toLocaleTimeString()}</span>
    }

    const action = {
      ScheduledTime:  formatTime,
      EstDeparture:   formatTime,
      TimeStamp:      formatDate,
      Status:         formatStatus,
      Track:          (track) => { return Boolean(track) ? track : "TBD" }
    }

    if(action[column])
      return action[column](value)
    else
      return value
  }

  setSchedule(schedule) {
    const filteredSchedule = schedule.filter((s) => {
      if(this.state.filter){
        return s.Destination.toLowerCase().includes(this.state.filter)
      } else {
        return true
      }
    })

    const addEstDeparture = (row) => {
      const estDeparture = Number(row.ScheduledTime) + Number(row.Lateness)
      return _.assign(row, {EstDeparture: estDeparture})
    }

    const revSchedule = filteredSchedule.map(addEstDeparture)
    this.setState({schedule: revSchedule})
  }

  executeSearch(search) {
    this.previousSearch && this.previousSearch.abort()
    clearTimeout(this.previousTimer)

    this.previousTimer = setTimeout( () =>
      this.previousSearch = search(),
      500
    )
  }

  fetchSchedule() {
    console.log("FETCHING")
    return $.getJSON(this.props.endpoint)
      .done(this.setSchedule.bind(this))
      .fail((xhr, text_status, error_thrown) => {
        console.warn("Aborting fetching departures, please try again", text_status)
        if (text_status != "abort") {
          console.error("Error fetching schedule data, please try again", text_status)
        }
      })
  }

  togglePolling(check) {
    if(check){
      const search = () => { this.executeSearch(this.fetchSchedule.bind(this)) }
      const interval = setInterval(search, parseInt(this.props.intervalTime))
      this.setState({interval: interval, poll: true})
    } else {
      this.setState({poll: false})
      clearInterval(this.state.interval)
    }
  }

  handleKeyPress(e) {
    const value = e.target.value
    const filterSearch = (filterValue) => {
      this.setState({filter: filterValue.toLowerCase()})
      return this.fetchSchedule()
    }

    this.executeSearch(() => filterSearch(value))
  }

  handlePollChange(e) {
    this.togglePolling(e.target.checked)
  }

  handleButtonClick(e) {
    e.preventDefault()
    this.executeSearch(this.fetchSchedule.bind(this))
  }

  now() {
    const today = new Date()
    const day = today.toLocaleString('en-us', { weekday: 'long' })
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
          {this.polling()}
        </div>
        <ResponsiveTable rows={schedule} columns={this.columnNames()} format={this.formatMap.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(
  <ScheduleFeedDepartures
    intervalTime={ 5000 }
    polling={ false }
    endpoint={ window.APP_API_DEPARTURES }
  />, document.getElementById("departureApp")
)
