import { Form, Box, Button } from 'react-bulma-components';
const {Field, Control, Label, Help } = Form;

const InputUrl = ({url, ref, onClick, onChange, ...rest}) => {
  return (
    <Field>
      <Control>
        <Label className="sub-label label">Url :</Label>
        <input className="input" defaultValue={url} onChange={onChange} type="text" {...rest} />
      </Control>
    </Field>
  )
}

const InputValue = ({value, ref, onClick, onChange, ...rest}) => {
  return (
    <Field>
      <Control>
          <Label className="sub-label label">Name :</Label>
          <input className="input" defaultValue={value} onChange={onChange} type="text" {...rest} />
        </Control>
      </Field>
    )
}

const TextAreaValue = ({value, ref, onClick, onChange, ...rest}) => {
  return (
    <Field>
      <Control>
          <Label className="sub-label label">Name :</Label>
          <textarea className="textarea" defaultValue={value} onChange={onChange} type="text" {...rest} />
        </Control>
      </Field>
    )
}

const Input = ({value, url,  i_content, i_name, i_url, nameReference, refUrl, refValue, onClick, onChange, ...rest}) => {
    return(
      <Box>
        <Field className="field field-social">
          <Label className="label-field">{value} :</Label>
          <Control className="field-flex">
            <InputValue i_name={i_name} defaultValue={value} onChange={onChange} type="text" {...rest}/>
            {nameReference !== "textContentServices" &&
              <InputUrl i_url={i_url} defaultValue={url} onChange={onChange} type="text" {...rest}/>
            }
            {nameReference === "textContentServices" &&
              <TextAreaValue i_content={i_content} defaultValue={url} onChange={onChange} type="text" {...rest}/>
            }
            <Field>
              <Button className="button is-primary delete-field"
              onClick={onClick}>Supprimer</Button>
            </Field>
          </Control>
        </Field>
      </Box>
    )
  }

  export default Input