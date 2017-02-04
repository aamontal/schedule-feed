use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :schedule_feed, ScheduleFeed.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :schedule_feed, ScheduleFeed.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "schedule_feed_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :schedule_feed,
  departures_url: "/api/sample_feed.json"
