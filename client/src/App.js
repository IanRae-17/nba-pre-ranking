import DatabaseSelect from "./components/DatabaseSelect";
import List from "./components/List";

import { useState } from "react";

function App() {
  const [type, setType] = useState("PTS");

  return (
    <>
      <DatabaseSelect setType={(type) => setType(type)} />
      <List type={type} />
    </>
  );
}

export default App;
