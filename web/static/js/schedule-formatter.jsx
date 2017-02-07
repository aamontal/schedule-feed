import React from 'react'
import _ from "lodash"

export default class ScheduleFormatter {

  static columnNames() {
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

  // assigns a new row onto a table based on a mapping function
  static assignVirtualColumns(table) {
    const addEstDeparture = (row) => {
      const estDeparture = Number(row.ScheduledTime) + Number(row.Lateness)
      return _.assign(row, {EstDeparture: estDeparture})
    }

    return table.map(addEstDeparture)
  }

  // applies a formatting function to a given column by column key
  static formatMap(columnKey, value) {
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

    if(action[columnKey])
      return action[columnKey](value)
    else
      return value
  }
}
