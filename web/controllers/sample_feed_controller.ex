defmodule ScheduleFeed.SampleFeedController do
  use ScheduleFeed.Web, :controller

  def departures(conn, _params) do
    json(conn, sample_feed())
  end

  defp sample_feed() do
    [%{"Destination" => "Newburyport", "Lateness" => "0",
       "Origin" => "North Station", "ScheduledTime" => "1486087800",
       "Status" => "Now Boarding", "TimeStamp" => "1486087254", "Track" => "4",
       "Trip" => "179"},
     %{"Destination" => "Haverhill", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486088400", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "225"},
     %{"Destination" => "Lowell", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486089900", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "343"},
     %{"Destination" => "Rockport", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486092000", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "127"},
     %{"Destination" => "Wachusett", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486093200", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "431"},
     %{"Destination" => "Newburyport", "Lateness" => "0",
       "Origin" => "North Station", "ScheduledTime" => "1486093800",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "181"},
     %{"Destination" => "Lowell", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486094100", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "345"},
     %{"Destination" => "Haverhill", "Lateness" => "0", "Origin" => "North Station",
       "ScheduledTime" => "1486094400", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "227"},
     %{"Destination" => "Readville", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486087200", "Status" => "All Aboard",
       "TimeStamp" => "1486087254", "Track" => "11", "Trip" => "785"},
     %{"Destination" => "Forge Park / 495", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486087200",
       "Status" => "All Aboard", "TimeStamp" => "1486087254", "Track" => "4",
       "Trip" => "727"},
     %{"Destination" => "Kingston", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486089000", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "055"},
     %{"Destination" => "Worcester / Union Station", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486089300",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "535"},
     %{"Destination" => "Stoughton", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486089600", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "925"},
     %{"Destination" => "Needham Heights", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486090200",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "629"},
     %{"Destination" => "Wickford Junction", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486090800",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "835"},
     %{"Destination" => "Readville", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486090800", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "787"},
     %{"Destination" => "Greenbush", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486090800", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "093"},
     %{"Destination" => "Middleboro/Lakeville", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486092600",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "029"},
     %{"Destination" => "Forge Park / 495", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486092600",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "729"},
     %{"Destination" => "Worcester / Union Station", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486092600",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "537"},
     %{"Destination" => "Stoughton", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486093200", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "927"},
     %{"Destination" => "Kingston", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486093200", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "057"},
     %{"Destination" => "Readville", "Lateness" => "0", "Origin" => "South Station",
       "ScheduledTime" => "1486094400", "Status" => "On Time",
       "TimeStamp" => "1486087254", "Track" => "", "Trip" => "789"},
     %{"Destination" => "Providence", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486094400",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "837"},
     %{"Destination" => "Needham Heights", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486095600",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "631"},
     %{"Destination" => "Worcester / Union Station", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486096200",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "539"},
     %{"Destination" => "Forge Park / 495", "Lateness" => "0",
       "Origin" => "South Station", "ScheduledTime" => "1486097400",
       "Status" => "On Time", "TimeStamp" => "1486087254", "Track" => "",
       "Trip" => "731"}]
  end
end
