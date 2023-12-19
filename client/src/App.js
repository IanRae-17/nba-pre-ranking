// React
import { useState } from "react";

// Components
import DatabaseSelect from "./components/DatabaseSelect";
import List from "./components/List";

function App() {
  const [type, setType] = useState("PTS"); // Criteria starts on total points

  return (
    <>
      <DatabaseSelect setType={(type) => setType(type)} />
      <List type={type} />
    </>
  );
}

export default App;
