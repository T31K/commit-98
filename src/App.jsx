import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useEscape from "./hooks/useEscape";
import { Command } from "@tauri-apps/plugin-shell";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

function App() {
  useEscape();

  const [workingDir, setWorkingDir] = useState(
    "/Users/t31k/Projects/commit-anywhere/tauri-macos-spotlight-example/"
  );
  const [commitMsg, setCommitMsg] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  // Animate the progress bar in steps of 30px
  const animateProgressInSteps = (targetWidth) => {
    setProgressWidth(0);
    setProgressMessage("");
    const step = 30;
    const interval = 100; // 300ms between each step

    let currentWidth = 0;
    const timer = setInterval(() => {
      currentWidth += step;
      if (currentWidth >= targetWidth) {
        clearInterval(timer);
        // When animation is done, reset the width to 0
        setProgressWidth(0);
        setProgressMessage("");
        // Then invoke the "hide" command
        invoke("hide")
          .then(() => console.log("hide invoked"))
          .catch((err) => console.error("Error invoking hide:", err));
      } else {
        setProgressWidth(currentWidth);
        if (currentWidth >= targetWidth * 0.9) {
          setProgressMessage("Writing objects: 100%");
        } else if (currentWidth >= targetWidth * 0.6) {
          setProgressMessage("git push");
        } else if (currentWidth >= targetWidth * 0.4) {
          setProgressMessage("git commit");
        } else if (currentWidth >= targetWidth * 0.2) {
          setProgressMessage("git add .");
        }
      }
    }, interval);
  };

  useHotkeys(
    "enter",
    async (event) => {
      event.preventDefault();
      const dir = workingDir.trim();
      const msg = commitMsg.trim() || "fix";
      console.log("Starting command...");

      // Animate the progress bar in increments up to 200px
      animateProgressInSteps(480);

      try {
        const result = await Command.create("exec-git", [
          "-c",
          `cd ${dir} && git add . && git commit -m "${msg}" && git push`,
        ]).execute();

        console.log("Command finished:", result);
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
            className="w-[380px]"
            onChange={(e) => setWorkingDir(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label htmlFor="commitMsg">Commit msg</label>
          <input
            id="commitMsg"
            type="text"
            autoCorrect="off"
            className="w-[380px]"
            placeholder="if none, it will be 'fix'"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
          />
        </div>
        <span className="progress-message">{progressMessage}</span>
        <div className="progress-indicator segmented mt-10">
          <span
            className="progress-indicator-bar"
            style={{
              width: `${progressWidth}px`,
              transition: "none", // Disable smooth transition for stepped animation
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
