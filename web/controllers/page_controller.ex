defmodule ScheduleFeed.PageController do
  use ScheduleFeed.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
