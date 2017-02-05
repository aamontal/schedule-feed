import React from 'react'
import ReactDOM from "react-dom"
import ScheduleFeedDepartures from './schedule-feed-departures'

ReactDOM.render(
  <ScheduleFeedDepartures
    endpoint={ window.APP_API_DEPARTURES }
  />, document.getElementById("departureApp")
)
