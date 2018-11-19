import React , { Component } from "react"
import PropTypes from "prop-types"


class TextField extends Component {
    static propTypes = {
        style:PropTypes.object, //Style passed to the text field
        value:PropTypes.string, //Value of the text field
        floatingLabelText:PropTypes.string, //Material ui floating label text for the input
        onFocusOut:PropTypes.func,// callback to be executed on focusing out of component
        type:PropTypes.string,//DOM input field type
        name:PropTypes.string.isRequired,//DOM input field name (required for setting the value of the component through postvalidation)
        postValidation:PropTypes.func.isRequired,//callback to execute post validation of the component
        trim:PropTypes.bool,//Whether to trim the value of the component
        regex:PropTypes.
    }
}   