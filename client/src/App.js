// React
import { useState } from "react";

// Components
import DatabaseSelect from "./components/DatabaseSelect";
import List from "./components/List";

function App() {
  const [type, setType] = useState("PTS"); // Criteria starts on total points
  const [label, setLabel] = useState("Points"); // Label starts on points

  return (
    <>
      <DatabaseSelect
        setType={(type) => setType(type)}
        setLabel={(label) => setLabel(label)}
      />
      <List type={type} label={label} />
    </>
  );
}

export default App;
