import React , { Component } from "react"
import PropTypes from "prop-types"

import {validateUsername} from "../../../utils/validations"


export default class TextField extends Component {
    static propTypes = {
        style:PropTypes.object, //Style passed to the text field
        value:PropTypes.string, //Value of the text field
        floatingLabelText:PropTypes.string, //Material ui floating label text for the input
        onFocusOut:PropTypes.func,// callback to be executed on focusing out of component
        type:PropTypes.string,//DOM input field type
        name:PropTypes.string.isRequired,//DOM input field name (required for setting the value of the component through postvalidation)
        postValidation:PropTypes.func.isRequired,//callback to execute post validation of the component
        trim:PropTypes.bool,//Whether to trim the value of the component
        regex:PropTypes.array.isRequired,//To understand
        externalErrorText:PropTypes.string,// Any external error that can cause the validation of the field to fail eg api validation
        pauseDuration:PropTypes.number,//pause duration for the field to validate the field
        disabled:PropTypes.bool,//Whether the field is disabled.
        required:PropTypes.required,//Whether the field is required
    }

    static defaultProps = {
        postValidation:() => {},
        externalErrorText:'',
        pauseDuration:2,
        required:false,
        regex:[/.*/]
    }

    constructor(props,context) {
        super(props);
        this.validationMethod = () => {}; 
        this.timer = null;
        this.state = {
            //Field is invalid if it's not required or disabled.
            valid:(!props.required || props.disabled) || false,
            errorMessage:'', //Any error message associated with the field
            name:props.name, //Name of the field
            value:props.value,//Value of the field
            blurred:false //Whether the field is currently blurred or not.
        }
    }

    componentWillMount() {
        const { name } = this.props;
        switch(name) {
            case 'username':
            this.validationMethod = validateUsername
            break;
        
        }
    }

    validate = (regex,value) => {
        if(this.props.required || value && !this.props.disabled){
            return { ...this.validationMethod(regex,value.trim()), value:value.trim()}
        } else {
            return {
                valid:this.state.valid,
                errorMessage:this.state.errorMessage,
                value:value.trim(),
                forceValidate:false
            }
        }
    }

    setValidationStatus = validationStatus => {
        validationStatus && this.setState({
            valid:this.state.errorMessage ? false :validationStatus.valid, //To handle external error text
            errorMessage:validationStatus.errorMessage,
            blurred:true,// Validation status is set only when field is blurred.
            paused:false,
            forceValidate:validationStatus.forceValidate,
            value: validationStatus.value
        })
    }

    shouldComponentUpdate() {
        //Check if state was updated.
        const stateUpdated = Boolean(nextProps.externalErrorText !== this.props.externalErrorText ||
            (nextState.valid !== this.state.valid ||
              nextState.errorMessage !== this.state.errorMessage ||
              nextState.value !== this.state.value))

          //Pause unpause
          const pauseChanged = (nextState.paused !== this.state.paused)
          //Focus change
          const focusChanged = (nextState.blurred !== this.state.blurred)
          //Force validation changed
          const forceValidate = (nextState.forceValidate !== this.state.forceValidate)

          
        if (stateUpdated) {
            return true
         }

        if ((!stateUpdated || nextState.blurred) && focusChanged) {
            return true
        }

        if (pauseChanged && nextState.paused) {
        return true
        }
        
        if (forceValidate && nextState.forceValidate) {
        return true
        }
        
          // Check for display name of endicon -> To ask.
          if (nextProps.endIcon && (nextProps.endIcon.type.displayName !== this.props.endIcon.type.displayName)) {
            return true
          }

          return false
    }

    componentDidMount(){
        if(this.props.value) {
            //Validate value if passed from container component
            // and set state to validation rules.
            const validationStatus = this.validate(this.props.regex, this.props.value)
            this.setState({
              valid: validationStatus.valid,
              errorMessage: validationStatus.errorMessage,
              name: this.props.name,
              value: this.props.value,
              blurred: true,
              forceValidate: validationStatus.forceValidate
            })
        }
    else {
        //Run postvalidation to update the upper component's state after mounting.
        this.props.postValidation(this.state)
        }
    }

    _onBlur = e => {
    const validationStatus = this.validate(this.props.regex, e.target.value)
    this.setValidationStatus(validationStatus)
    }

    _disableCopyPaste = (e) => {
        //Disabling copy paste if passed in props.
        if (!this.props.copyPaste) {
          e.preventDefault()
          return false
        } else {
          return true
        }
      }

      _onChange = (e, value) => {
        //Clear the previous pause timer set
        window.clearTimeout(this.timer)
        const isFileInput = (this.props.type === 'file')
        // if (isFileInput) {
        //   e.stopPropagation()
        //   e.target.blur()
        //   return false
        // }
        const inputValue = e.target.value
    
        if (this.state.value !== inputValue) {
          this.setState({
            value: this.props.trim ? inputValue.trim() : inputValue,
            errorMessage: '',
            files:e.target.files,
            blurred: false,
            paused: false
          })
          //Start a new pause timer
          this.timer = window.setTimeout(() => {
            //Run validation after passed paused duration.
            const validationStatus = this.validate(this.props.regex, this.state.value)
            this.setValidationStatus(validationStatus)
          }, this.props.pauseDuration * 1000)
        }
      }

      _getErrorText (errorText, styles) {
        if (errorText && errorText.length) {
          return (
            <span style={styles.errorText}>
              {errorText}
              <ErrorIcon
                style={styles.errorIcon}
                color={'error'}
              />
            </span>
          )
        }
      }

      render() {
        const { floatingLabelText, fullWidth, type, style, disabled, name, id } = this.props
        const { errorMessage, value } = this.state
        const styles = getStyles(this.props, theme)
    
        const textFieldProps = {
          ...this.props,
          required:false,
          name : (this.props.type === 'file') ? 'attachment[]' : name,
          value,
          onChange:this._onChange,
          margin:'normal',
          label:floatingLabelText,
          helperText:errorMessage && this._getErrorText(errorMessage, styles),
          onBlur:this._onBlur,
          onCopy:this._disableCopyPaste,
          onPaste:this._disableCopyPaste,
          InputProps:{
            endAdornment: this.props.endIcon && (
              <InputAdornment position='end' onClick={this.props.onEndIconClick}>
                {this.props.endIcon}
              </InputAdornment>
              ),
            startAdornment: this.props.startIcon && (
              <InputAdornment position='start' onClick={this.props.onStartIconClick}>
                {this.props.startIcon}
              </InputAdornment>
            ),
            ...this.props.InputProps
          }
        }
    
        // if (this.props.type !== 'file') {
        //   textFieldProps.value = value
        // }
    
        return (
          <FormControl fullWidth>
            <TextField
              {...textFieldProps}
            />
          </FormControl>
        )
      }


}   