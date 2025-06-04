const { execSync } = require("child_process");
const fs = require("fs");
require("dotenv").config();

const flowsDir = "./.maestro";
const flows = fs.readdirSync(flowsDir).filter((file) => file.endsWith(".yml"));

flows.forEach((flow) => {
  const command = `maestro test "${flowsDir}/${flow}"`;
  console.log(`Running: ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
});
