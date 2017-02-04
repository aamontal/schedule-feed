defmodule ScheduleFeed.PageController do
  use ScheduleFeed.Web, :controller

  def index(conn, _params) do
    render conn, "index.html", params: _params, api_depart: Application.get_env(:schedule_feed, :departures_url)
  end
end
