module.exports = {
  types: [
    {
      value: 'feat',
      name: '✨ 新功能',
    },
    {
      value: 'fix',
      name: '🐛 bug修复',
    },
    {
      value: 'refactor',
      name: '🎨 重构代码',
    },
    {
      value: 'perf',
      name: '👌 性能优化',
    },
    {
      value: 'build',
      name: '📦 构建过程修改',
    },
    {
      value: 'ci',
      name: '📦 CI修改',
    },
    {
      value: 'docs',
      name: '📖 文档更新',
    },
    {
      value: 'chore',
      name: '🙈 其他修改',
    },
  ],

  scopes: [],

  messages: {
    type: '提交类型:',
    subject: '简短说明:',
    confirmCommit: '确认提交?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],
}
