import { Form, Box, Button, Icon } from 'react-bulma-components';
import Icons from '../components/Icon'
const {Field, Control, Label, Help, InputFile } = Form;

const Files = ({name, value, onChange, ...rest}) => {
  return (
    <Box style={{marginBottom: "10px"}}>
    <Field>
      <Control>
            <Label htmlFor={name} className="sub-label label">{name}</Label>
            <InputFile
                icon={<Icon icon="upload" size="large" />}
                boxed
                name={name}
                onChange={onChange}
                {...rest}
            />
        </Control>
    </Field>
    </Box>
  )
}

export default Files