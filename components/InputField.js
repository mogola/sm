import { Form } from 'react-bulma-components';
const {Field, Control, Label, Help } = Form;
const ErrorPasswordMessage = 'Input Password and Submit [7 to 15 characters which contain at least one numeric digit and a special character]'

const InputField = ({labelName, getValue, onChange, name, booleanerror = "false", classValidator = '', ...rest}) => {
    return(
       <Field>
            <Label htmlFor={name}>{labelName}</Label>
            <div className="control">
                <input
                    className={`input ${classValidator}`}
                    name={name}
                    onChange={onChange}
                    booleanerror={booleanerror.toString()}
                    {...rest}
                />
                {name === "password" &&
                booleanerror &&
                    <Help className={`${classValidator}`}>{ErrorPasswordMessage}</Help>
                }
            </div>
        </Field>
      )
  }

export default InputField