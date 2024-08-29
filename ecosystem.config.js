module.exports = {
    apps: [
      {
        name: "dashboard-etl",
        script: "node",
        args: "node_modules/next/dist/bin/next start -p 3005",
        env: {
          NODE_ENV: "production",
          PORT: 3005,
        }
      },
    ],
  };
  