const path = require("path");

// PM2 process for Next.js (VPS or WSL).
// From repo root: pm2 start deploy/vps/ecosystem.config.cjs

const root = path.resolve(__dirname, "../..");

module.exports = {
  apps: [
    {
      name: "asteria",
      cwd: root,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      error_file: path.join(root, "storage/logs/pm2-error.log"),
      out_file: path.join(root, "storage/logs/pm2-out.log"),
      time: true,
    },
  ],
};
