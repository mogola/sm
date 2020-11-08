import { Form, Box, Button } from 'react-bulma-components';
const {Field, Control, Label, Help } = Form;

const InputConfig = ({name, value, onChange, ...rest}) => {
  return (
    <Box style={{marginBottom: "10px"}}>
    <Field>
      <Control>
            <Label htmlFor={name} className="sub-label label">{name}</Label>
            <input
                name={name}
                className="input"
                onChange={onChange}
                {...rest} />
        </Control>
    </Field>
    </Box>
  )
}

export default InputConfig