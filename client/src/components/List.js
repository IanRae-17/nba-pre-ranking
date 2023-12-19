// React
import { useState, useEffect, useMemo } from "react";
// React Query
import { useQuery } from "@tanstack/react-query";
// Axios
import axios from "axios";
// Components
import PlayerRow from "./PlayerRow";

function List({ type }) {
  const [list, setList] = useState([...Array(10)].map(() => null));
  const [activePlayer, setActivePlayer] = useState(null);
  const [nextPlayer, setNextPlayer] = useState(true);
  const [skips, setSkips] = useState(1);
  const [skippedPlayer, setSkippedPlayer] = useState(null);
  const [finished, setFinished] = useState(false);

  // Request to get players, count = 11 to account for skip, changes stat rating based on type
  const getPlayers = async (count = 11) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/randomPlayers/${count}/${type}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching random players:", error.message);
      throw error;
    }
  };

  // Query for players
  const {
    data: players,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Players"],
    queryFn: () => getPlayers(),
    staleTime: Infinity,
  });

  // Refetch data when type changes, and reset game
  useEffect(() => {
    handleReset();
  }, [type]);

  // Handle Game Finished
  useEffect(() => {
    if (
      list.filter((item) => item !== null).length === 10 &&
      players &&
      !finished
    ) {
      setFinished(true);
      // Get final array
      let finalPlayers = [];
      if (skippedPlayer) {
        finalPlayers = players.filter(
          (player) => player.player_id !== players[skippedPlayer].player_id
        );
      } else {
        finalPlayers = players.filter((player, idx) => idx < 10);
      }

      // Sort array
      let sortedPlayers = finalPlayers.sort((a, b) => {
        return b.rating - a.rating;
      });

      let tempList = list.map((player, idx) => {
        return {
          ...player,
          correct: player.rating === sortedPlayers[idx].rating,
        };
      });

      setList(tempList);
    }
  }, [list]);

  useEffect(() => {
    // Set the activePlayer to the first item in the players array
    if (players && players.length > 0) {
      setActivePlayer(0);
    }
  }, [players]);

  function handleReset() {
    setList([...Array(10)].map(() => null));
    setActivePlayer(null);
    setNextPlayer(true);
    setSkips(1);
    setSkippedPlayer(null);
    setFinished(false);
    refetch();
  }

  function handleSkipPlayer() {
    setSkips((prevSkips) => prevSkips - 1);

    // Remove activePlayer from list if there
    let tempList = [...list];

    const searchIndex = tempList.findIndex((player) => {
      // Check if the player has a name property and it matches the active player's name
      return (
        player &&
        player.player_name &&
        players[activePlayer] &&
        player.player_name === players[activePlayer].player_name
      );
    });

    if (searchIndex !== -1) {
      tempList[searchIndex] = null;
    }

    setList(tempList);
    setSkippedPlayer(activePlayer);
    setActivePlayer((prevActivePlayer) => prevActivePlayer + 1);
  }

  function handleAddPlayer(idx) {
    let tempList = [...list];

    const searchIndex = tempList.findIndex((player) => {
      // Check if the player has a name property and it matches the active player's name
      return (
        player &&
        player.player_name &&
        players[activePlayer] &&
        player.player_name === players[activePlayer].player_name
      );
    });

    if (searchIndex !== -1) {
      tempList[searchIndex] = null;
    }

    tempList[idx] = players[activePlayer];

    setList(tempList);
    setNextPlayer(false);
  }

  function handleQuickAddPlayer(idx) {
    handleAddPlayer(idx);
    handleNextPlayer(idx);
  }

  function handleNextPlayer() {
    setActivePlayer((prevActivePlayer) => prevActivePlayer + 1);
    setNextPlayer(true);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="list-container">
      <div className="column left-column">
        {/* <div className="row-container-header">
          <div className="criteria-header">{label && label}</div>
        </div> */}
        {list &&
          list.map((item, idx) => (
            <PlayerRow
              key={idx}
              player={item}
              idx={idx}
              handleAddPlayer={() => handleAddPlayer(idx)}
              handleQuickAddPlayer={() => handleQuickAddPlayer(idx)}
              activePlayer={players[activePlayer]}
              finished={finished}
            />
          ))}
      </div>
      {finished ? (
        <div className="final-score">
          {list.filter((player) => player.correct).length + " / 10"}
        </div>
      ) : (
        <div className="column right-column">
          <div className="button-container">
            <div></div>
            <div>{activePlayer + 1 + (skips - 1) + " / 10"}</div>
            <button
              className="skip"
              onClick={() => handleSkipPlayer()}
              disabled={!(skips > 0)}
            >
              {"Skips: " + skips}
            </button>
            <button
              className="player-button"
              onClick={() => handleNextPlayer()}
              disabled={nextPlayer}
            >
              Next Player
            </button>
          </div>

          <div className="player-container">
            {players[activePlayer] && (
              <>
                <div className="img-container">
                  <img
                    src={`https://cdn.nba.com/headshots/nba/latest/260x190/${players[activePlayer].player_id}.png`}
                    alt={`${players[activePlayer].player_name} Image`}
                    className="player-image"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn.nba.com/headshots/nba/latest/260x190/fallback.png";
                    }}
                  />
                </div>

                <h1>{players[activePlayer].player_name}</h1>
              </>
            )}
          </div>
        </div>
      )}
      <button className="reset" onClick={() => handleReset()}>
        Reset
      </button>
    </div>
  );
}

export default List;
