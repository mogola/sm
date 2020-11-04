import { Box, Form} from 'react-bulma-components';
const {Field,Control, Label, Help } = Form;

const TextareaConfig = ({name, value, onChange, ...rest}) => {
  return (
    <Box style={{marginBottom: "10px"}}>
        <Field>
            <Control>
                <Label htmlFor={name} className="sub-label label">{name}</Label>
                <textarea
                    name={name}
                    className="textarea"
                    onChange={onChange}
                    {...rest} >
                </textarea>
            </Control>
        </Field>
    </Box>
  )
}

export default TextareaConfig