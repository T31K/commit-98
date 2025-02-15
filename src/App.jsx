import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useEscape from "./hooks/useEscape";
import { Command } from "@tauri-apps/plugin-shell";

import "./App.css";

function App() {
  useEscape();

  // State for the working directory, commit message, and progress bar width
  const [workingDir, setWorkingDir] = useState(
    "/Users/t31k/Projects/commit-anywhere/tauri-macos-spotlight-example/"
  );
  const [commitMsg, setCommitMsg] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);

  // When Enter is pressed, run the git command and animate the progress bar
  useHotkeys(
    "enter",
    async (event) => {
      event.preventDefault(); // Prevent the default form action if any
      const dir = workingDir.trim();
      const msg = commitMsg.trim() || "fix"; // Default commit message to "fix" if empty
      console.log("helllo");

      // Animate the progress bar
      setProgressWidth(0); // Reset progress bar
      setTimeout(() => setProgressWidth(200), 0); // Start animation

      // Invoke the Tauri command 'git_commit' (you must implement this on the Rust side)
      try {
        let result = await Command.create("exec-git", [
          "-c",
          `cd ${dir} && git add . && git commit -m "${msg}" && git push`,
        ]).execute();
        console.log("after");
        console.log(result);
      } catch (error) {
        console.error("Error executing git command:", error);
      }
    },
    { enableOnTags: ["INPUT", "TEXTAREA"] },
    [workingDir, commitMsg]
  );

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
          <label htmlFor="workingDir">Working dir</label>
          <input
            id="workingDir"
            type="text"
            autoCorrect="off"
            value={workingDir}
            onChange={(e) => setWorkingDir(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label htmlFor="commitMsg">Commit msg</label>
          <input
            id="commitMsg"
            type="text"
            autoCorrect="off"
            placeholder="if none, it will be 'fix'"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
          />
        </div>
        <div className="progress-indicator segmented mt-10">
          <span
            className="progress-indicator-bar"
            style={{
              width: `${progressWidth}px`,
              transition: "width 3s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
