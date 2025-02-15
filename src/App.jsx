import useEscape from "./hooks/useEscape";

import "./App.css";

function App() {
  useEscape();

  return (
    <div
      className="window flex flex-col"
      style={{ width: "500px", height: "180px" }}
    >
      <div className="title-bar">
        <div className="title-bar-text">Select a commit</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <div className="field-row">
          <label for="text17">Working dir</label>
          <input id="text17" type="text" autoCorrect="off" />
        </div>
        <div className="field-row">
          <label for="text17">Commit msg </label>
          <input
            id="text17"
            type="text"
            autoCorrect="off"
            placeholder="iif none, it will be 'fix'"
          />
        </div>
        <div className="progress-indicator segmented mt-10">
          <span className="progress-indicator-bar !w-[50px]" />
        </div>
      </div>
    </div>
  );
}

export default App;
