import React, {Component, PropTypes} from 'react'
import ResponsiveTable from './responsive-table'
import ScheduleFormatter from './schedule-formatter'

export default class ScheduleFeedDepartures extends Component {
  constructor(props) {
    super(props)

    this.state = {
      schedule: [],
      filter: '',
      interval: null,
      poll: props.polling
    }

    this.handleButtonClick  = this.handleButtonClick.bind(this)
    this.handlePollChange   = this.handlePollChange.bind(this)
    this.handleKeyPress     = this.handleKeyPress.bind(this)
    this.getSchedule        = this.getSchedule.bind(this)
    this.decorateSchedule   = this.decorateSchedule.bind(this)

    // poll no faster than 5s
    this.intervalTime = Math.max(parseInt(this.props.intervalTime), 5000)
  }

  componentDidMount() {
    this.executeSearch(this.getSchedule)
    this.togglePolling(this.state.poll)
  }

  handleKeyPress(e) {
    const value = e.target.value
    const filterSearch = (filterValue) => {
      this.setState({filter: filterValue.toLowerCase()})
      return this.getSchedule()
    }

    this.executeSearch(() => filterSearch(value))
  }

  handlePollChange(e) {
    this.togglePolling(e.target.checked)
  }

  handleButtonClick(e) {
    e.preventDefault()
    this.executeSearch(this.getSchedule)
  }

  // calls api for schedule
  getSchedule() {
    console.log("FETCHING...")

    return $.getJSON(this.props.endpoint)
      .done(this.decorateSchedule)
      .fail((xhr, text_status, error_thrown) => {
        console.warn("Aborting fetching departures", text_status)
        // abort some fetches on purpose to avoid a race condition
        if (text_status != "abort") {
          console.error("Error fetching schedule data, please try again", text_status)
        }
      })
  }

  // applies filtering and assigns virtual columns to a fetched schedule
  decorateSchedule(rawSchedule) {
    const filteredSchedule = rawSchedule.filter((s) => {
      if(this.state.filter){
        return s.Destination.toLowerCase().includes(this.state.filter)
      } else {
        return true
      }
    })

    const schedule = ScheduleFormatter.assignVirtualColumns(filteredSchedule)
    this.setState({schedule: schedule})
  }

  executeSearch(search) {
    // If server is slow on a particular request it could overwrite a more recent one.
    // Abort if a previous search is still happening.
    // see http://stackoverflow.com/questions/35179831/js-ajax-typeahead-result-ordering-race-condition
    this.previousSearch && this.previousSearch.abort()
    clearTimeout(this.previousTimer)

    this.previousTimer = setTimeout( () =>
      this.previousSearch = search(),
      500
    )
  }

  togglePolling(check) {
    if(check){
      const search = () => { this.executeSearch(this.getSchedule) }
      const interval = setInterval(search, this.intervalTime)
      this.setState({interval: interval, poll: true})
    } else {
      this.setState({poll: false})
      clearInterval(this.state.interval)
    }
  }

  renderToday() {
    const today = new Date()
    const day = today.toLocaleString('en-us', { weekday: 'long' })
    const date = today.toLocaleDateString('en-us')
    return `${day} ${date}`
  }

  renderSearchInput() {
    return(
      <div className="spread">
        <input name="search" type="text" onKeyUp={this.handleKeyPress} />
        <button onClick={this.handleButtonClick}>search</button>
      </div>
    )
  }

  renderHeader() {
    return(
      <div className="flexContainer">
        <div className="spread">
          <label htmlFor="today" className="control-label">Today:</label>
          <span name="today" className="spread">{this.renderToday()}</span>
        </div>
        <div className="spread">
          <label htmlFor="isPolling" className="control-label">Last Updated:</label>
          <span className="spread" name="lastUpdated"><em>{new Date().toLocaleTimeString()}</em></span>
        </div>
      </div>
    )
  }

  renderPolling() {
    return(
     <div className="spread">
        <label htmlFor="isPolling" className="control-label">Auto-refresh:</label>
        <span className="spread">
        <input
          name="isPolling"
          type="checkbox"
          checked={this.state.poll}
          onChange={this.handlePollChange} />
        </span>
      </div>
    )
  }

  render() {
    const {schedule} = this.state
    console.log("rendering...", schedule.length)
    return (
      <div>
        {this.renderHeader()}
        <div className="flexContainer">
          {this.renderSearchInput()}
          {this.renderPolling()}
        </div>
        <ResponsiveTable
          rows={schedule}
          columns={ScheduleFormatter.columnNames()}
          formatMap={ScheduleFormatter.formatMap}
        />
      </div>
    )
  }
}

ScheduleFeedDepartures.propTypes = {
  intervalTime: PropTypes.number,
  polling: PropTypes.bool,
  endpoint: PropTypes.string.isRequired
}

ScheduleFeedDepartures.defaultProps = {
  intervalTime: 5000,
  polling: false
}
