# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :schedule_feed,
  ecto_repos: [ScheduleFeed.Repo]

# Configures the endpoint
config :schedule_feed, ScheduleFeed.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "9zwzu9Y0pLaUV9ho3u3hy6kMpouYIuYmUN7Wp4dIJUgbaiNciJ9PHjBeHg7QGg2G",
  render_errors: [view: ScheduleFeed.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ScheduleFeed.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
