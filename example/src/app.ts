import { Component } from 'react'
import './app.css'

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentWillUnmount(){}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
