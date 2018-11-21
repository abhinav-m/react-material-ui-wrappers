import React, { Component } from "react";

import TextField from "../components/wrappers/forms/TextField"

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:''
    }
  }
  render() {
    return <div>
    <TextField name="name" />;
    </div>
  }
}
