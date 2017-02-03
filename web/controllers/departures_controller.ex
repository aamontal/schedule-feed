defmodule ScheduleFeed.BoardController do
  use ScheduleFeed.Web, :controller

    def departures(conn, _params), do: boards("/departures.csv", conn)

    defp boards(path, conn) do
      case ScheduleFeed.Board.get(path) do
        {:ok, response}  -> json(conn, response.body)
        {:error, reason} -> json(conn, reason)
      end
    end

end
