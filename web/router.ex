defmodule ScheduleFeed.Router do
  use ScheduleFeed.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ScheduleFeed do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", ScheduleFeed do
    pipe_through :api

    get "/departures.json",   BoardController, :departures
    get "/sample_feed.json",  SampleFeedController, :departures
  end
end
