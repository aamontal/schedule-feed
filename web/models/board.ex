require IEx
# http://developer.mbta.com/lib/gtrtfs/Departures.csv 

defmodule ScheduleFeed.Board do
  use HTTPoison.Base

  def process_url(url) do
    "http://developer.mbta.com/lib/gtrtfs" <> url
  end

  def process_response_body(body) do
    body
    |> String.trim
    |> String.split("\r\n")
    |> CSV.decode(headers: true)
  end

end
