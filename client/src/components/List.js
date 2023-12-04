import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useState, useEffect } from "react";
import PlayerRow from "./PlayerRow";

function List() {
  const [list, setList] = useState([...Array(10)].map(() => null));
  const [activePlayer, setActivePlayer] = useState(null);
  const [nextPlayer, setNextPlayer] = useState(true);
  const [skips, setSkips] = useState(1);
  const [skippedPlayer, setSkippedPlayer] = useState(null);
  const [finished, setFinished] = useState(false);

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
          (player) => player._id !== players[skippedPlayer]._id
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

  // Request
  const getPlayers = async (count = 11) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/randomPlayers/${count}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching random players:", error.message);
      throw error;
    }
  };

  // Queries
  const {
    data: players,
    isLoading,
    isError,
  } = useQuery({
    queryKey: "Players",
    queryFn: () => getPlayers(),
    staleTime: Infinity,
  });

  useEffect(() => {
    // Set the activePlayer to the first item in the players array
    if (players && players.length > 0) {
      setActivePlayer(0);
    }
  }, [players]);

  function handleSkipPlayer() {
    setSkips((prevSkips) => prevSkips - 1);

    // Remove activePlayer from list if there
    let tempList = [...list];

    const searchIndex = tempList.findIndex((player) => {
      // Check if the player has a name property and it matches the active player's name
      return (
        player &&
        player.name &&
        players[activePlayer] &&
        player.name === players[activePlayer].name
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
        player.name &&
        players[activePlayer] &&
        player.name === players[activePlayer].name
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
    handleNextPlayer();
  }

  function handleNextPlayer() {
    setActivePlayer((prevActivePlayer) => prevActivePlayer + 1);
    setNextPlayer(true);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="list-container">
      <div className="column left-column">
        {list &&
          list.map((item, idx) => (
            <PlayerRow
              key={idx}
              player={item}
              idx={idx}
              handleAddPlayer={() => handleAddPlayer(idx)}
              handleQuickAddPlayer={() => handleQuickAddPlayer(idx)}
              activePlayer={players[activePlayer]}
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
          {players[activePlayer] && (
            <div className="player-container">
              {players[activePlayer].img_link ? (
                <img
                  src={players[activePlayer].img_link}
                  alt={`${players[activePlayer].name} Image`}
                  className="player-image"
                />
              ) : (
                <img
                  src={
                    "https://cdn.nba.com/headshots/nba/latest/260x190/fallback.png"
                  }
                  alt={`Fallback Image`}
                  className="player-image"
                />
              )}
              <h1>{players[activePlayer].name}</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default List;
