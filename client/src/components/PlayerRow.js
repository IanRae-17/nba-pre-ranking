import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
function PlayerRow({
  player,
  idx,
  handleAddPlayer,
  handleQuickAddPlayer,
  activePlayer,
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
      {player && player.img_link ? (
        <img
          src={player.img_link}
          alt={`${player.name} Image`}
          className="player-image"
        />
      ) : (
        <img
          src={"https://cdn.nba.com/headshots/nba/latest/260x190/fallback.png"}
          alt={`Fallback Image`}
          className="player-image"
        />
      )}
      <div>{player && player.name}</div>
      <div>
        {player && player.correct !== undefined && (
          <FontAwesomeIcon
            icon={player.correct ? faCheck : faX}
            className={player.correct ? "green" : "red"}
          />
        )}
      </div>
    </div>
  );
}

export default PlayerRow;
