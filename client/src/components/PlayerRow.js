// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

function PlayerRow({
  player,
  idx,
  handleAddPlayer,
  handleQuickAddPlayer,
  activePlayer,
  finished,
}) {
  return (
    <div
      className="row-container"
      onClick={
        player && activePlayer !== player
          ? undefined
          : () => handleAddPlayer(idx)
      }
      onDoubleClick={
        player && activePlayer !== player
          ? undefined
          : () => handleQuickAddPlayer(idx)
      }
    >
      <div>{idx + 1}</div>
      {player && (
        <img
          src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.player_id}.png`}
          alt={`${player.player_name} Image`}
          className="player-image"
          onError={(e) => {
            e.target.src =
              "https://cdn.nba.com/headshots/nba/latest/260x190/fallback.png";
          }}
        />
      )}
      <div>{player && player.player_name}</div>
      <div>
        {player && player.correct !== undefined && (
          <FontAwesomeIcon
            icon={player.correct ? faCheck : faX}
            className={player.correct ? "green" : "red"}
          />
        )}
      </div>
      {finished && <div>{player.rating}</div>}
    </div>
  );
}

export default PlayerRow;
