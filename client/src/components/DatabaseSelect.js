// Assets
import stat_headers from "../assets/stat_headers";

function DatabaseSelect({ setType, setLabel }) {
  function handleTypeChange(e) {
    setType(
      e.target.selectedIndex > 8
        ? stat_headers[e.target.value]
        : stat_headers[e.target.value] + "_PG"
    );
    setLabel(
      e.target.selectedIndex > 8 ? e.target.value : e.target.value + " Per Game"
    );
  }

  return (
    <div className="selection-container">
      <h2 className="selection-info">Choose Criteria: </h2>
      <select onChange={handleTypeChange}>
        <option value="" className="selection-header" disabled={true}>
          Per Game
        </option>

        {Object.keys(stat_headers).map((stat) => (
          <option key={stat_headers[stat] + "_PG"} value={stat}>
            {stat}
          </option>
        ))}

        <option value="" className="selection-header" disabled={true}>
          Totals
        </option>

        {Object.keys(stat_headers).map((stat) => (
          <option key={stat_headers[stat]} value={stat}>
            {stat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DatabaseSelect;
