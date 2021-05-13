try {
  const cp = require('child_process')
  cp.exec(`cd ${require.main.paths[0].split('node_modules')[0]} && taro router-gen`)
} catch (err) {}
