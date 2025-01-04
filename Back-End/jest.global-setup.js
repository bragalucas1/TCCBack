const { execSync } = require("child_process");

module.exports = async () => {
  execSync("npx prisma generate", { stdio: "inherit" });
};
